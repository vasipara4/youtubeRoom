document.addEventListener('DOMContentLoaded', function(event) {

  //initialize html


  let turnOn = $("#turnOnTheParty");

  turnOn.click(function() {


    delay(1000).then(function() {
      hideHtmlElement("chatOption");
      showHtmlPartyInfo();
    });

  });
  copyBtn();

  // TODO: OPTIONS PAGE

  // TODO: GET SAVED



});



/**
 * It's loading the state of extension's html page when it's clicked
 */
function loadPage() {
  // TODO: UI of app

}


/**
 * Functionality of copy button
 */
function copyBtn() {
  var copyBtn = $("#copyBtn");
  var copyBtnText = $("#copyBtnText");


  copyBtn.click(function() {
    var sharingAddress = document.getElementById("url");

    sharingAddress.select();
    sharingAddress.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("copy");
    copyBtn.focus();
    copyBtnText.__uikit__.tooltip.title = "Copied";

    console.log(copyBtnText);
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
  chrome.tabs.query({
    active: true,
    currentWindow: true,
    url: "https://*.youtube.com/watch?*"
  }, function(tabs) {
    const port = chrome.tabs.connect(tabs[0].id);
    port.postMessage({
      messageType: message.type,
      chatEnabled: message.chat,
      tabID: tabs[0].id,
      tabURL: tabs[0].url
    });
  });

}


function delay(t, v) {
  return new Promise(function(resolve) {
    setTimeout(resolve.bind(null, v), t)
  });
}



function showHtmlPartyInfo() {
  var infoShare = $("#infoShare").removeClass("uk-hidden");
  var shareWithFriends = $("#shareWithFriends").removeClass("uk-hidden");
}


function hideHtmlPartyInfo() {
  var infoShare = $("#infoShare").addClass("uk-hidden");
  var shareWithFriends = $("#shareWithFriends").addClass("uk-hidden");
}

function hideHtmlElement(id) {
  var element = $("#" + id).addClass("uk-hidden");
}

function showHtmlElement(id) {
  var element = $("#" + id).removeClass("uk-hidden");
}

function editHtmlElementText(id, text) {
  var element = $("#" + id).text(text);
}

const SyncState = {
  "IDLE": 0,
  "CREATED_ROOM": 1,
  "JOINED_ROOM": 2
}

const ChatState = {
  "HIDE": 0,
  "SHOW": 1
}


function getChromeStorage() {
  chrome.storage.local.get(['syncState', 'chatState'], function(data) {
    if (data.syncState == SyncState.CREATED_ROOM) {
      (data.chatState == ChatState.HIDE) ?

    } else if (data.syncState == SyncState.JOINED_ROOM) {


    } else {
      hideHtmlParty();
    }


  });



}
