const crypto = require("crypto");
const otpModel = require("../Models/otp.model");
const pendingRegistrationModel = require("../Models/pendingRegistration.model");
const { otpGenerator, getOtpHtml } = require("../Utils/utils");
const { sendEmail } = require("./email.services");

const generateAndSendOtp = async (email, registrationId) => {
  const otp = otpGenerator();
  const otpHtml = getOtpHtml(otp);
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  await otpModel.deleteMany({ registrationId });

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await otpModel.create({
    email,
    registrationId,
    otpHash,
    expiresAt
  });

  await sendEmail(
    email,
    "TRANSACTIFY Email Verification Code",
    `Your verification code is: ${otp}`,
    otpHtml
  );
};

const verifyOtpRecord = async (registrationId, otp) => {
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  const otpDocument = await otpModel.findOne({
    registrationId,
    otpHash
  });

  if (!otpDocument) {
    throw new Error("INVALID_OTP");
  }

  if (Date.now() > new Date(otpDocument.expiresAt).getTime()) {
    await otpModel.deleteOne({ _id: otpDocument._id });
    throw new Error("OTP_EXPIRED");
  }

  await otpModel.deleteOne({ _id: otpDocument._id });
  return true;
};

module.exports = { generateAndSendOtp, verifyOtpRecord};