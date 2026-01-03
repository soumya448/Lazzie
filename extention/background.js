console.log("Background service worker started");

const WS_URL = "ws://localhost:3000";
let ws = null;
let sessionId = null;

function connect() {
  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log("WebSocket connected");
    ws.send(JSON.stringify({ type: "CREATE_SESSION" }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "SESSION_CREATED") {
      sessionId = data.sessionId;
      console.log("Session ID:", sessionId);
    }

    if (data.type === "MEDIA_CONTROL") {
      forwardToContentScript(data.action);
    }
  };

  ws.onclose = () => {
    console.log("WebSocket disconnected");
  };
}

function forwardToContentScript(action) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length) return;

    chrome.tabs.sendMessage(tabs[0].id, { action });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_SESSION") {
    sendResponse({ sessionId });
  }
});


connect();
