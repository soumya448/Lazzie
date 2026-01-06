const os = require("os");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const {
  createSession,
  joinSession,
  getSessionByClient,
  removeSessionByClient,
} = require("./sessions");

//we can not get local IP address from extension directly due to security reasons hence we do it from server side
//helper function for detecting local IP address
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (
        iface.family === "IPv4" &&
        !iface.internal &&
        iface.address.startsWith("192.")
      ) {
        return iface.address;
      }
    }
  }

  return "127.0.0.1";
}




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
        const ip = getLocalIPAddress();
        ws.send(JSON.stringify({ type: "SESSION_CREATED", sessionId, ip }));
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
