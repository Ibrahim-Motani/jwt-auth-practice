const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false
  },
  username: {
    unique: true,
    type: String,
    required: [true, "Username is required"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
