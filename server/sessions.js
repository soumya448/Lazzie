const { randomUUID } = require("crypto");

const sessions = new Map();

/**
 * Create session (desktop)
 */
function createSession(desktopWS) {
  const sessionId = randomUUID();
  sessions.set(sessionId, {
    desktopWS,
    mobileWS: null,
  });
  return sessionId;
}

/**
 * Mobile joins session
 */
function joinSession(sessionId, mobileWS) {
  const session = sessions.get(sessionId);
  if (!session) return false;

  session.mobileWS = mobileWS;
  return true;
}

/**
 * Find session by any client
 */
function getSessionByClient(ws) {
  for (const [sessionId, session] of sessions.entries()) {
    if (session.desktopWS === ws || session.mobileWS === ws) {
      return { sessionId, session };
    }
  }
  return null;
}

/**
 * Cleanup
 */
function removeSessionByClient(ws) {
  for (const [sessionId, session] of sessions.entries()) {
    if (session.desktopWS === ws || session.mobileWS === ws) {
      sessions.delete(sessionId);
      return sessionId;
    }
  }
}

module.exports = {
  createSession,
  joinSession,
  getSessionByClient,
  removeSessionByClient,
};
