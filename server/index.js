const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const {
  createSession,
  joinSession,
  getSessionByClient,
  removeSessionByClient,
} = require("./sessions");

const app = express();
const server = http.createServer(app);


app.use("/mobile", express.static(__dirname + "/../mobile"));

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    let data;
    try {
      data = JSON.parse(msg.toString());
    } catch {
      return;
    }

    switch (data.type) {
      case "CREATE_SESSION": {
        const sessionId = createSession(ws);
        ws.send(JSON.stringify({ type: "SESSION_CREATED", sessionId }));
        console.log("Session created:", sessionId);
        break;
      }

      case "JOIN_SESSION": {
        const success = joinSession(data.sessionId, ws);
        ws.send(JSON.stringify({
          type: success ? "SESSION_JOINED" : "SESSION_INVALID",
        }));
        break;
      }

      case "MEDIA_CONTROL": {
        const result = getSessionByClient(ws);
        if (!result) return;

        const { session } = result;
        const target =
          session.desktopWS === ws
            ? session.mobileWS
            : session.desktopWS;

        if (target && target.readyState === WebSocket.OPEN) {
          target.send(JSON.stringify(data));
        }
        break;
      }
    }
  });

  ws.on("close", () => {
    removeSessionByClient(ws);
    console.log("Client disconnected");
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});

app.get("/", (_, res) => {
  res.send("WebSocket server running 🚀");
});
