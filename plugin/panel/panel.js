const tabId = chrome.devtools.inspectedWindow.tabId;
const port = chrome.runtime.connect(null, { name: `panel-${tabId}` });

const dataElement = document.getElementById('data');

port.onMessage.addListener((data) => {
    handleData(data);
});

function handleData(message) {
    const element = document.createElement('div');
    element.innerText = message;

    dataElement.appendChild(element);
}

// const tabId = chrome.devtools.inspectedWindow.tabId;
// const port = chrome.runtime.connect(null, { name: `panel-${tabId}` });

console.log('TURBO KEKE 4Eburek!!');
console.log(port);