const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
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
    password: {
      type: String,
      required: [true, "Password is required for registration"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    systemUser: {
      type: Boolean,
      default: false,
      immutable: true,
      select: false
    }
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const isAlreadyHashed = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(this.password);
  if (isAlreadyHashed) {
    return;
  }

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;