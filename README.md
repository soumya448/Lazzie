```markdown
# Lazzie 🎮

> Control browser media from your phone using WebSockets (LAN-only)

Lazzie is a Chrome extension + WebSocket-based system that lets you control media playing in your desktop browser (play, pause, volume) using your phone as a remote.

**Both devices must be connected to the same Wi-Fi network.**

No apps. No cloud. No external services.

---

## ✨ Features

- 📱 Control desktop browser video from your phone
- 🔗 LAN-only communication (same Wi-Fi)
- 🔐 Session-based pairing
- ⚡ Real-time control using native WebSockets
- 🧩 Chrome Extension (Manifest V3 compatible)
- 🌐 Mobile-friendly web controller (no app install)

---

## 🏗️ Architecture Overview

```
Mobile Browser ── WebSocket ──┐
                               ├── Node.js WebSocket Server
Chrome Extension ─ WebSocket ─┘
```

- **Server:** Node.js + `ws`
- **Desktop:** Chrome Extension (MV3)
- **Mobile:** Simple HTML + JavaScript
- **Protocol:** JSON messages over native WebSockets

---

## 📁 Project Structure

```
qr-media-remote/
│
├── server/
│   ├── index.js        # WebSocket server
│   ├── sessions.js     # Session management
│   └── package.json
│
├── mobile/
│   ├── index.html      # Mobile controller UI
│   ├── script.js
│   └── style.css
│
└── extension/
    ├── manifest.json
    ├── background.js   # WebSocket client (desktop)
    ├── content.js      # Media control logic
    └── popup.html
```

---

## 🚀 How It Works

1. Chrome extension connects to the local WebSocket server
2. Server creates a session ID
3. Phone connects to the server and joins the session
4. Phone sends media commands
5. Extension receives commands and controls `<video>` elements

---

## ▶️ Setup & Run

### 1️⃣ Start the Server

```bash
cd server
npm install
node index.js
```

Server runs on: `ws://localhost:3000`

### 2️⃣ Load the Chrome Extension

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `extension/` folder
5. Reload the extension

Check logs via: `chrome://extensions` → **Inspect views** → **service worker**

### 3️⃣ Open Mobile Controller

1. Open `mobile/index.html` on your phone
2. Ensure phone and desktop are on the same Wi-Fi
3. Join the session using the session ID (or QR in future version)

---

## 📡 Message Protocol (WebSocket)

All communication uses JSON:

```json
{ "type": "CREATE_SESSION" }
{ "type": "SESSION_CREATED", "sessionId": "..." }
{ "type": "JOIN_SESSION", "sessionId": "..." }
{ "type": "MEDIA_CONTROL", "action": "PLAY" }
```

---

## 🔒 Security Notes

- Works only on local network
- Sessions are temporary and in-memory
- No external servers or tracking
- No data persistence

---

## 🛠️ Tech Stack

- Node.js
- WebSocket (`ws`)
- Chrome Extensions (Manifest V3)
- HTML / CSS / JavaScript

---

## 📌 Future Improvements

- [ ] QR code–based pairing
- [ ] Multi-tab media selection
- [ ] Playback state feedback
- [ ] UI polish for mobile controller
- [ ] Auto-reconnect handling

---

## 👤 Author

**Built by Soumyadeep Bhattacharya**  
Project name: **Lazzie**

---

<div align="center">
  <sub>Made with ❤️ for lazy media control</sub>
</div>
```