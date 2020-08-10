const urlSession = "&youtubeRoom=";
document.addEventListener("DOMContentLoaded", function (event) {
  let turnOn = $("#turnOnTheParty");
  let turnOnText = $("#turnOnThePartyText");

  chrome.tabs.query({
  active: true,
  currentWindow: true
}, function(tabs) {
  chrome.storage.local.get(["roomId", "roomUrl"], function(result) {
    var id = getID(tabs[0].url, urlSession);
    console.log("id is " + id);
    if (id != -1) {
      chrome.storage.local.set({
          roomId: id,
          roomUrl: tabs[0].url,
        },
        () => {
          console.log("id is:" + id + " and joinRoom on");
          chrome.tabs.sendMessage(tabs[0].id, {
            joinRoom: "on",
            roomId: id
          });
          turnOnText.html("Leave the Room");
          showHtmlPartyInfo(tabs[0].url);
        }
      );
    } else if (result.roomId == 0 || result.roomId == null) {
      turnOnText.html("Create the Room");
      hideHtmlPartyInfo();
    } else {
      console.log(result.roomId);
      turnOnText.html("Leave the Room");
      showHtmlPartyInfo(result.roomUrl);
      chrome.tabs.sendMessage(
        tabs[0].id, {
          alreadyConnected: "on",
          roomUrl: result.roomId,
          roomId: result.roomId
        }
      );
    }
  });
});


  turnOn.click(function () {
    chrome.storage.local.get(["roomId"], function (result) {
      if (result.roomId === 0 || result.roomId === null) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (
          tabs
        ) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { initializeRoom: "on", url: tabs[0].url },
            function (response) {
              if (chrome.runtime.lastError) {
                // Something went wrong
                console.warn("Whoops.. " + chrome.runtime.lastError.message);
                // Maybe explain that to the user too?
              } else {
                turnOnText.html("Leave the Room");
                showHtmlPartyInfo(response.url);
              }
            }
          );
        });
      } else {
        turnOnText.html("Create the Room");
        chrome.tabs.query({ active: true, currentWindow: true }, function (
          tabs
        ) {
          chrome.tabs.sendMessage(tabs[0].id, { disconnect: "on" });
          if(getID(tabs[0].url, urlSession) != -1){
            var urlToRemove = "&youtubeRoom=" + getID(tabs[0].url, urlSession);
            chrome.tabs.update(tabs[0].id, {url: tabs[0].url.replace(urlToRemove,"")});
          }

        });

        hideHtmlPartyInfo();
      }
    });
  });

  copyBtn();
});



  // TODO: OPTIONS PAGE


const pageState = { initial: 0, roomJoined: 1, roomFound: 2 };

/**
 * It's loading the state of extension's html page when it's clicked
 */
function loadPage(state) {
  if (state == pageState.initial) {
  }

  // TODO: UI of app
}

/**
 * Functionality of copy button
 */
function copyBtn() {
  var copyBtn = $("#copyBtn");
  var copyBtnText = $("#copyBtnText");

  copyBtn.click(function () {
    var sharingAddress = document.getElementById("url");

    sharingAddress.select();
    sharingAddress.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("copy");
    showHtmlElement("copySuccess");
    delay(500).then(function(){
      hideHtmlElement("copySuccess");
    });




  });
}

/**
 * Sending request to start a party
 * @return {string} response is a url if the room was created /
 * if not, response is "error"
 */
function turnOnTheParty(message) {
  var response = sendMessage(message.type, message.chat);
  return response;
}

/**
 *  This function is used for communication between extension page
 *  and its content_script. Its a Long-lived connection, so we
 *  established a port.
 *
 *  Ports are designed as a two-way communication method between
 *  different parts of the extension
 *
 * @param  {JSON)} message =
 * { type: ("create" , "join"),
 *   chat: (true , false) }
 *
 * @return {string}
 */
function sendMessage(message) {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
      url: "https://*.youtube.com/watch?*",
    },
    function (tabs) {
      const port = chrome.tabs.connect(tabs[0].id);
      port.postMessage({
        messageType: message.type,
        chatEnabled: message.chat,
        tabID: tabs[0].id,
        tabURL: tabs[0].url,
      });
    }
  );
}

function delay(t, v) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

function showHtmlPartyInfo(text) {
  var infoShare = $("#infoShare").removeClass("uk-hidden");
  var shareWithFriends = $("#shareWithFriends").removeClass("uk-hidden");
  document.getElementById("url").setAttribute("value", text);
}

function hideHtmlPartyInfo() {
  var infoShare = $("#infoShare").addClass("uk-hidden");
  var shareWithFriends = $("#shareWithFriends").addClass("uk-hidden");
}

function hideHtmlElement(id) {
  $("#" + id).addClass("uk-hidden");
}

function showHtmlElement(id) {
  $("#" + id).removeClass("uk-hidden");
}

function editHtmlElementText(id, text) {
  $("#" + id).text(text);
}

function getChromeStorage() {
  chrome.storage.local.get(["syncState", "chatState"], function (data) {
    if (data.syncState == SyncState.CREATED_ROOM) {
      // (data.chatState == ChatState.HIDE) ?
    } else if (data.syncState == SyncState.JOINED_ROOM) {
    } else {
      hideHtmlParty();
    }
  });
}

function getID(url, ruleString) {
  var selector = ruleString;
  console.log("selector " + selector);
  var location = url;
  console.log("location " + location);
  if (location.indexOf(selector) != -1) {
    console.log("if statement"+location.indexOf(selector));
    var index = location.indexOf(selector) + ruleString.length;
    console.log("index fun" + index);
    var id = location.substring(index);
    console.log(id);
    return id;
  } else
    return -1;
}
