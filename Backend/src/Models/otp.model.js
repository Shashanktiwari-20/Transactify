const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pendingRegistration",
      required: [true, "registrationId is required"]
    },
    otpHash: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }
    }
  },
  { timestamps: true }
);

const otpModel = mongoose.model("otps", otpSchema);
module.exports = otpModel;