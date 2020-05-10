// chrome.browserAction.onClicked.addListener(function () {
//   //  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
//   //window.location.href += '&userID=afdsfs342342';
// });
let tabId;
let currentUrl;

// chrome.tabs.onCreated.addListener(function() {window.location.href += "&userid=dsadasdasd";});
chrome.windows.onCreated.addListener(function() {
  chrome.storage.local.remove(["checkSyncMe", "checkGetSync"], function() {

  });
});
// chrome.webNavigation.onDOMContentLoaded.addListener(  function (details) {
//   console.log("DOM content");
//   console.log(details);
// });

chrome.webNavigation.onHistoryStateUpdated.addListener( function (details) {
  tabId = details.tabId;
 currentUrl = details.url;
  console.log(details.url);

  // chrome.tabs.executeScript(details.tabId, {
  //   file: "content_script.js",
  // });
},
{
  url: [
    {
      hostContains: ".youtube.",
    },
    {
      urlContains: ".youtube.com/watch?",
    }
  ]//,
}
);

// 
// chrome.webRequest.onCompleted.addListener(function(details) {
//   const parsedUrl = new URL(details.url);
// if (currentUrl && currentUrl.indexOf(parsedUrl.pathname) > -1 && tabId) {
//     console.log("new page request by youtube");
//     chrome.tabs.insertCSS(details.tabId, { file: "css/chat.css" });
//     chrome.tabs.executeScript(details.tabId, {
//       file: "content_script.js",
//     });
//     // chrome.tabs.sendMessage(tabId, { type: 'page-rendered'});
//   }
// }, { urls: ['*://*.youtube.com/watch*'] });


//
// chrome.webNavigation.onCompleted.addListener(
//   function (details) {
//     // chrome.tabs.executeScript(details.tabId, {
//     //   file: "js/uikit.min.js",
//     // });
//     console.log("new page");
//     // chrome.tabs.insertCSS(details.tabId, { file: "css/uikit.min.css" }, function () {
//     //   console.log("injected uikit.min.css");
//     // });
//     // chrome.tabs.insertCSS(details.tabId, { file: "css/chat.css" });
//     // chrome.tabs.insertCSS(details.tabId, { file: "js/uikit.min.js" });
//     // chrome.tabs.insertCSS(details.tabId, { file: "js/uikit-icons.js" });
//   },
//   {
//     url: [
//       {
//         hostContains: ".youtube.",
//       }
//       // ,{
//       //   urlContains: ".youtube.com/watch?",
//       // },
//     ]//,
//   }
// );



// only load for URLs that match youtube.com/watch?*
chrome.runtime.onInstalled.addListener(function(details) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
            hostContains: '.youtube.',
            urlContains: '.youtube.com/watch?',
            schemes: ['http', 'https']
          }
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
