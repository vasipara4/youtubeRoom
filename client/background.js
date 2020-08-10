chrome.windows.onCreated.addListener(function () {
  chrome.storage.local.remove(["roomId", "roomUrl"], function () {
    console.log("Erased room storage");
  });
});

// only load for URLs that match youtube.com/watch?*
chrome.runtime.onInstalled.addListener(function (details) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostContains: ".youtube.",
              urlContains: ".youtube.com/watch?",
              schemes: ["http", "https"],
            },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});
