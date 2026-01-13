function normalizeRegisterPayload(body) {
  return {
    email: body?.email ?? "",
    password: body?.password ?? "",
    name: body?.name ?? "",
    phone: body?.phone ?? null,
  };
}

function normalizeLoginPayload(body) {
  return {
    email: body?.email ?? "",
    password: body?.password ?? "",
  };
}

function normalizeForgotPasswordPayload(body) {
  return {
    email: body?.email ?? "",
  };
}

function normalizeResetPasswordPayload(body) {
  return {
    token: body?.token ?? "",
    password: body?.password ?? "",
  };
}

function normalizeVerifyEmailPayload(body) {
  return {
    token: body?.token ?? "",
  };
}

function buildMemberResponse(member) {
  return {
    id: String(member.id),
    email: member.email,
    name: member.name,
    phone: member.phone,
    isVerified: member.isVerified,
    createdAt: member.createdAt,
  };
}

function buildLoginResponse(token, member) {
  return {
    token,
    user: buildMemberResponse(member),
  };
}

module.exports = {
  normalizeRegisterPayload,
  normalizeLoginPayload,
  normalizeForgotPasswordPayload,
  normalizeResetPasswordPayload,
  normalizeVerifyEmailPayload,
  buildMemberResponse,
  buildLoginResponse,
};
