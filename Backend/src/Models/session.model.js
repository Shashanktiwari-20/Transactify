const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User reference is required"]
    },
    refreshTokenHash: {
      type: String,
      required: [true, "Hashed refresh token is required"]
    },
    ip: {
      type: String,
      required: [true, "IP address is required"]
    },
    userAgent: {
      type: String,
      required: [true, "User agent is required"]
    },
    revoked: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const SessionModel = mongoose.model("sessions", sessionSchema);
module.exports = SessionModel;