# java-selenium-ui-locators
This Chrome extension helps testers and developers quickly identify web element locators for automation testing using Java + Selenium. When the extension is clicked, users can select any element on the webpage, and a small overlay will display the best possible locator along with alternatives.

Features --
✅ Finds web element locators dynamically
✅ Displays locators in Java + Selenium format
✅ Supports ID, Name, Class, CSS Selector, and XPath
✅ Prioritizes locators based on best practices (ID > CSS > XPath > Name > Class)
✅ Click outside the overlay to dismiss it

Installation --

Download or clone this repository.

Open Chrome and go to chrome://extensions/.

Enable Developer Mode (toggle in the top right corner).

Click Load Unpacked and select the project folder.

The extension icon should now appear in the Chrome toolbar.

Usage --

Click the extension icon.

Click on any element on the webpage.

A small overlay will appear at the bottom-right corner, showing the locators.

Click outside the overlay to dismiss it.

Example Output - 
****************************************************************
Best Locator:
ID = driver.findElement(By.id("searchBox"));

Alternatives:
Name = driver.findElement(By.name("q"));
Class = driver.findElement(By.className("search-input"));
CSS = driver.findElement(By.cssSelector("#searchBox"));
XPath = driver.findElement(By.xpath("//*[@id='searchBox']"));

*******************************************************************
FILES --

manifest.json - Defines the extension details and permissions.

background.js - Handles extension activation.

content.js - Contains the main logic for capturing locators and displaying the overlay.

License--

This project is open-source and free to use. Feel free to contribute! 🎉
