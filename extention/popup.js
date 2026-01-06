const qrContainer = document.getElementById("qr");

chrome.runtime.sendMessage(
  { type: "GET_SESSION" },
  (response) => {
    if (!response || !response.sessionId) {
      qrContainer.textContent = "No session";
      return;
    }

    const ip = response.ip || "localhost";
    const sessionId = response.sessionId;

    // TEMP: hostname only (we improve this in Enhancement #2)
    const url = `http://${ip}:3000/mobile/index.html?session=${sessionId}`;

    new QRCode(qrContainer, {
      text: url,
      width: 180,
      height: 180,
    });
  }
);
