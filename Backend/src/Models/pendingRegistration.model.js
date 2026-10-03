const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const pendingRegistrationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required for registration"],
      lowercase: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email Address"],
      unique: [true, "Email already exists."]
    },
    name: {
      type: String,
      required: [true, "Name is required for registration"]
    },
    passwordHash: {
      type: String,
      required: true
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

pendingRegistrationSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) {
    return;
  }
  const hash = await bcrypt.hash(this.passwordHash, 10);
  this.passwordHash = hash;
});

const pendingRegistrationModel = mongoose.model("pendingRegistration", pendingRegistrationSchema);
module.exports = pendingRegistrationModel;