const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("../Config/Config");
const SessionModel = require("../Models/session.model");


const createTokensAndSession = async (user, ip, userAgent) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = new SessionModel({
    userId: user._id,
    refreshTokenHash: "placeholder",
    ip,
    userAgent,
    expiresAt
  });

  const accessToken = jwt.sign({userId: user._id,email: user.email,name: user.name},config.JWT_SECRET,{ expiresIn: "15m" });

  const refreshToken = jwt.sign({userId: user._id,sessionId: session._id},config.JWT_SECRET,{ expiresIn: "7d" });
  session.refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

  await session.save();

  return { accessToken, refreshToken };
};

const rotateSessionToken = async (incomingRefreshToken, ip, userAgent) => {

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, config.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error("SESSION_EXPIRED");
    }
    throw new Error("INVALID_TOKEN");
  }

  const { sessionId } = decoded;
  if (!sessionId) {
    throw new Error("INVALID_TOKEN_PAYLOAD");
  }

  const session = await SessionModel.findById(sessionId).populate("userId");
  if (!session) {
    throw new Error("SESSION_NOT_FOUND");
  }

  if (session.revoked) {
    throw new Error("SESSION_REVOKED");
  }

  if (new Date() >= new Date(session.expiresAt)) {
    throw new Error("SESSION_EXPIRED");
  }

  const incomingHash = crypto.createHash("sha256").update(incomingRefreshToken).digest("hex");

  const isMatch = crypto.timingSafeEqual(
    Buffer.from(incomingHash, "hex"),
    Buffer.from(session.refreshTokenHash, "hex")
  );

  if (!isMatch) {
    session.revoked = true;
    await session.save();
    throw new Error("TOKEN_REUSE_DETECTED");
  }

  const newAccessToken = jwt.sign({ userId: session.userId._id, email: session.userId.email, name: session.userId.name},config.JWT_SECRET,{ expiresIn: "15m" });
  const newRefreshToken = jwt.sign({userId: session.userId._id,sessionId: session._id},config.JWT_SECRET,{ expiresIn: "7d" });

  session.refreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
  session.ip = ip;
  session.userAgent = userAgent;
  session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await session.save();

  return {accessToken: newAccessToken,refreshToken: newRefreshToken,user: session.userId};
};

const revokeSession = async (incomingRefreshToken) => {
  try {
    const decoded = jwt.decode(incomingRefreshToken);
    if (decoded?.sessionId) {
      await SessionModel.findByIdAndUpdate(decoded.sessionId, { revoked: true });
    }
  } catch (error) {
    console.warn("Session revocation warning during logout:", error.message);
  }
};

module.exports = {createTokensAndSession,rotateSessionToken,revokeSession};