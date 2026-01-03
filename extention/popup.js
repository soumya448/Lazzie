const qrContainer = document.getElementById("qr");

chrome.runtime.sendMessage(
  { type: "GET_SESSION" },
  (response) => {
    if (!response || !response.sessionId) {
      qrContainer.textContent = "No session";
      return;
    }

    const sessionId = response.sessionId;

    // TEMP: hostname only (we improve this in Enhancement #2)
    const url = `http://192.168.0.103:3000/mobile/index.html?session=${sessionId}`;

    new QRCode(qrContainer, {
      text: url,
      width: 180,
      height: 180,
    });
  }
);
