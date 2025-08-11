/**
 * Background script for JSON Format Converter Chrome Extension
 * Handles extension icon clicks to open the converter in a new tab
 */

// Listen for extension icon clicks
chrome.action.onClicked.addListener((tab) => {
    // Open popup.html in a new tab
    chrome.tabs.create({
        url: chrome.runtime.getURL('popup.html')
    });
});

// Optional: Handle installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('JSON Format Converter extension installed');
        
        // Optionally open the converter on first install
        chrome.tabs.create({
            url: chrome.runtime.getURL('popup.html')
        });
    }
});
