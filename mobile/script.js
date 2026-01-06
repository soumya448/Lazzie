const statusEl = document.getElementById("status");

// Get sessionId from URL
const params = new URLSearchParams(window.location.search);
const sessionId = params.get("session");

if (!sessionId) {
  statusEl.textContent = "No session ID found";
  throw new Error("Missing sessionId");
}


//dynamically determine ws or wss based on page protocol
// location.hostname determines server address
const protocol = location.protocol === "https:" ? "wss" : "ws";
const WS_URL = `${protocol}://${location.hostname}:3000`;

const ws = new WebSocket(WS_URL);

ws.onopen = () => {
  statusEl.textContent = "Connected";
  ws.send(
    JSON.stringify({
      type: "JOIN_SESSION",
      sessionId,
    })
  );
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "SESSION_JOINED") {
    statusEl.textContent = "Session joined";
  }

  if (data.type === "SESSION_INVALID") {
    statusEl.textContent = "Invalid session";
  }
};

ws.onclose = () => {
  statusEl.textContent = "Disconnected";
};

function sendAction(action) {
  if (ws.readyState !== WebSocket.OPEN) return;

  ws.send(
    JSON.stringify({
      type: "MEDIA_CONTROL",
      action,
    })
  );
}
