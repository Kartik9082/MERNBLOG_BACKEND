const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 5,
    max: 15,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin"],
      message: "Role must be either user, guide, lead-guide, or admin.",
    },
    default: "user",
  },
  bio: {
    type: String,
    min: 5,
    max: 2000,
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  active: {
    type: Boolean,
    default: true,
  },
});

// Pre_save Middlewares
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hashing the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Deleting passwordConfirm field

  this.confirmPassword = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// Instance methods
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
