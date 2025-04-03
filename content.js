// Remove old event listeners if they exist
if (window.locatorListener) {
    document.removeEventListener("click", window.locatorListener);
}

window.locatorListener = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Remove previous overlay if it exists
    let oldOverlay = document.getElementById("locator-overlay");
    if (oldOverlay) oldOverlay.remove();

    let element = event.target;

    // Generate locators
    let id = element.id ? `By.id("${element.id}")` : null;
    let name = element.name ? `By.name("${element.name}")` : null;
    let className = element.classList.length ? `By.className("${element.classList[0]}")` : null;
    let cssSelector = `By.cssSelector(${generateOptimizedCssSelector(element)})`;
    let xpath = `By.xpath(${generateXPath(element)})`;

    // Best Locator Precedence Logic:
    // 1. ID (if unique), 2. CSS Selector, 3. XPath
    let bestLocator = id || cssSelector || xpath;
    let bestLocatorType = id ? 'ID' : cssSelector ? 'CSS' : 'XPath';

    // Prepare content for output in the exact format
    let locatorText = `
Best Locator:
${bestLocator ? `${bestLocatorType} = driver.findElement(${bestLocator});` : ""}

Alternatives:
${id && bestLocator !== id ? `ID = driver.findElement(${id});` : ""}
${name ? `Name = driver.findElement(${name});` : ""}
${className ? `Class = driver.findElement(${className});` : ""}
${cssSelector && bestLocator !== cssSelector ? `CSS = driver.findElement("${cssSelector}");` : ""}
${xpath && bestLocator !== xpath ? `XPath = driver.findElement("${xpath}");` : ""}
    `.trim();

    showOverlay(locatorText);
};

// Attach event listener for one-time element selection
document.addEventListener("click", window.locatorListener, { once: true });

function generateOptimizedCssSelector(element) {
    // If element has an ID, return that as the selector
    if (element.id) return `#${element.id}`;
    
    // If element has a name attribute, return that as the selector
    if (element.name) return `[name="${element.name}"]`;

    let path = [];
    while (element && element !== document.body) {
        let tag = element.tagName.toLowerCase();

        // If there are multiple same type elements at the same level, use class or ID if available
        let siblings = [...element.parentElement.children].filter(e => e.tagName === element.tagName);
        if (siblings.length > 1) {
            if (element.id) {
                path.unshift(`#${element.id}`);
                break;
            } else if (element.classList.length > 0) {
                path.unshift(`.${element.classList[0]}`);
            } else {
                path.unshift(tag); // If no class or ID, fallback to tag name
            }
        } else {
            path.unshift(tag); // Use tag name if it's the only one of its kind
        }
        
        element = element.parentElement;
    }

    return path.join(" > ");
}
function generateXPath(element) {
    if (element.id) return `//*[@id='${element.id}']`;

    let path = [];
    while (element && element.nodeType === Node.ELEMENT_NODE) {
        let tag = element.tagName.toLowerCase();
        let siblings = [...element.parentNode.children].filter(e => e.tagName === element.tagName);
        let index = siblings.length > 1 ? `[${siblings.indexOf(element) + 1}]` : '';
        path.unshift(`${tag}${index}`);
        element = element.parentNode;
    }
    return `//${path.join('/')}`;
}

function showOverlay(code) {
    let overlay = document.createElement("div");
    overlay.id = "locator-overlay";
    overlay.innerHTML = `<pre style="user-select: text; white-space: pre-wrap; cursor: text;">${code}</pre>`;
    overlay.style.position = "fixed";
    overlay.style.bottom = "10px";
    overlay.style.right = "10px";
    overlay.style.background = "#222";
    overlay.style.color = "#fff";
    overlay.style.padding = "15px";
    overlay.style.borderRadius = "8px";
    overlay.style.zIndex = "10000";
    overlay.style.maxWidth = "400px";
    overlay.style.overflowX = "auto";
    overlay.style.fontFamily = "monospace";
    overlay.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";

    document.body.appendChild(overlay);

    // Ensure overlay does NOT disappear when clicked
    overlay.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    // Remove overlay when clicking outside of it
    setTimeout(() => {
        document.addEventListener("click", (e) => {
            if (!overlay.contains(e.target)) {
                overlay.remove();
            }
        }, { once: true });
    }, 100);
}
