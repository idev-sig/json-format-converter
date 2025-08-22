/**
 * Background script for JSON Format Converter Chrome Extension
 * Handles extension icon clicks to open the converter in a new tab
 */

// Use browser API for Firefox compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Use action API for Manifest V3 or browserAction for Manifest V2
const action = browserAPI === chrome ? chrome.action : browserAPI.browserAction;

// Listen for extension icon clicks
action.onClicked.addListener(() => {
    // Open popup.html in a new tab
    browserAPI.tabs.create({
        url: browserAPI.runtime.getURL('html/popup.html')
    });
});

// Optional: Handle installation
browserAPI.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('JSON Format Converter extension installed');
        
        // Optionally open the converter on first install
        browserAPI.tabs.create({
            url: browserAPI.runtime.getURL('html/popup.html')
        });
    }
});
