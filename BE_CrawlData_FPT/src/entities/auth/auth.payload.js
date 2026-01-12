// Auth payload helpers for request/response shaping.
// Normalize login input to a safe, predictable shape.
function normalizeLoginPayload(payload) {
  const data = payload || {};
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const password = typeof data.password === "string" ? data.password : "";

  return { email, password };
}

// Build response payload for a successful login.
function buildLoginResponse(token, user) {
  return {
    token,
    user: {
      id: String(user.id),
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

module.exports = {
  normalizeLoginPayload,
  buildLoginResponse,
};
