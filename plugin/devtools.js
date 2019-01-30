chrome.devtools.panels.create(
    'RxJS profiler',
    null,
    'panel/panel.html',
    null,
);

backgroundPageConnection.onMessage.addListener(function (message) {
    // Handle responses from the background page, if any
    console.log(message);
});

// Relay the tab ID to the background page
chrome.runtime.sendMessage({
    tabId: chrome.devtools.inspectedWindow.tabId,
    scriptToInject: "contentscript.js"
});