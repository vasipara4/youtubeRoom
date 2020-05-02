// chrome.browserAction.onClicked.addListener(function () {
//   //  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
//   //window.location.href += '&userID=afdsfs342342';
// });


// chrome.tabs.onCreated.addListener(function() {window.location.href += "&userid=dsadasdasd";});
chrome.windows.onCreated.addListener(function() {
  chrome.storage.local.remove(["checkSyncMe", "checkGetSync"], function() {

  });
});


//
// chrome.webNavigation.onCompleted.addListener(function(details) {
//   chrome.tabs.executeScript(details.tabId, {
//     file: 'contentScript.js'
//   });
//  }, {
//      url: ["https://*.youtube.com/watch?*"],
//  });

// only load for URLs that match www.netflix.com/watch/*
chrome.runtime.onInstalled.addListener(function(details) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
            // hostContains: '.youtube.',
            urlContains: '.youtube.com/watch?',
            schemes: ['http', 'https']
          }
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
