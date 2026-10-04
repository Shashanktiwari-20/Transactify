const UserModel = require("../Models/user.model");
const pendingRegistrationModel = require("../Models/pendingRegistration.model");
const { generateAndSendOtp, verifyOtpRecord } = require("../Services/otp.services");
const { createTokensAndSession, rotateSessionToken, revokeSession} = require("../Services/token.services");
const tokenBlackListModel = require("../Models/TokenBlackList.model")

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const registerUserController = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const isExists = await UserModel.findOne({ email });
    if (isExists) {
      return res.status(422).json({
        message: "Email is already registered. Please sign in.",
        status: "failed"
      });
    }

    let pending = await pendingRegistrationModel.findOne({ email });
    if (pending) {
      pending.name = name;
      pending.passwordHash = password;
      pending.isVerified = false;
      await pending.save();
    } else {
      pending = await pendingRegistrationModel.create({
        email,
        name,
        passwordHash: password,
        isVerified: false
      });
    }

    await generateAndSendOtp(email, pending._id);

    return res.status(201).json({
      message: "Verification code sent. Please verify your email.",
      registrationId: pending._id
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const resendVerificationOtp = async (req, res) => {
  try {
    const { registrationId, email } = req.body;
    const query = registrationId ? { _id: registrationId } : { email };
    const pending = await pendingRegistrationModel.findOne(query);

    if (!pending) {
      return res.status(404).json({
        message: "No pending registration found for this account."
      });
    }

    if (pending.isVerified) {
      return res.status(400).json({
        message: "Email is already verified. Complete your registration."
      });
    }

    await generateAndSendOtp(pending.email, pending._id);

    return res.status(200).json({
      message: "A new verification code has been dispatched to your email."
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const verifyRegisterUser = async (req, res) => {
  try {
    const { registrationId, otp } = req.body;

    if (!registrationId || !otp) {
      return res.status(400).json({ message: "Registration ID and OTP are required." });
    }

    const pending = await pendingRegistrationModel.findById(registrationId);
    if (!pending) {
      return res.status(404).json({ message: "Registration request not found or expired." });
    }

    await verifyOtpRecord(pending._id, otp);

    pending.isVerified = true;
    await pending.save();

    return res.status(200).json({
      message: "Email verified successfully.",
      registrationId: pending._id,
      verified: true
    });
  } catch (error) {
    if (error.message === "INVALID_OTP") {
      return res.status(422).json({ message: "Invalid OTP code provided." });
    }
    if (error.message === "OTP_EXPIRED") {
      return res.status(410).json({ message: "OTP has expired. Please request a new code." });
    }
    return res.status(500).json({ message: error.message });
  }
};

const completeRegistration = async (req, res) => {
  try {
    const { registrationId } = req.body;

    const pending = await pendingRegistrationModel.findById(registrationId);
    if (!pending) {
      return res.status(404).json({ message: "Registration session not found or expired." });
    }

    if (!pending.isVerified) {
      return res.status(403).json({ message: "Email has not been verified yet." });
    }

    const userAlreadyExists = await UserModel.findOne({ email: pending.email });
    if (userAlreadyExists) {
      await pendingRegistrationModel.findByIdAndDelete(pending._id);
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const newUser = await UserModel.create({
      name: pending.name,
      email: pending.email,
      password: pending.passwordHash,
      isVerified: true
    });

    await pendingRegistrationModel.findByIdAndDelete(pending._id);

    return res.status(201).json({
      message: "Registration completed successfully. Please sign in.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown IP";
    const userAgent = req.headers["user-agent"] || "Unknown Device";

    const { accessToken, refreshToken } = await createTokensAndSession(user, ip, userAgent);

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Login successful.",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const refreshTokenController = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
      return res.status(401).json({ message: "Refresh token is missing." });
    }

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown IP";
    const userAgent = req.headers["user-agent"] || "Unknown Device";

    const { accessToken, refreshToken, user } = await rotateSessionToken(
      incomingRefreshToken,
      ip,
      userAgent
    );

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    return res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.clearCookie("refreshToken", COOKIE_OPTIONS);

    if (
      ["SESSION_NOT_FOUND", "SESSION_REVOKED", "SESSION_EXPIRED", "TOKEN_REUSE_DETECTED"].includes(
        error.message
      )
    ) {
      return res.status(403).json({ message: "Session expired or invalid. Please sign in again." });
    }

    return res.status(401).json({ message: "Invalid session token." });
  }
};

const logoutController = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];
    if (incomingRefreshToken) {
      await tokenBlackListModel.create({
        token : incomingRefreshToken
      });
      await revokeSession(incomingRefreshToken);
    }

    res.clearCookie("refreshToken", COOKIE_OPTIONS);
    return res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {registerUserController,resendVerificationOtp,verifyRegisterUser,completeRegistration,loginController,refreshTokenController,logoutController
};