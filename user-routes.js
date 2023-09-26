const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./user-model");
const jsonwebtoken = require("jsonwebtoken");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is mandatory", status: "failed" });
  } else if (!password) {
    return res
      .status(400)
      .json({ message: "Password is mandatory", status: "failed" });
  } else if (!username) {
    return res
      .status(400)
      .json({ message: "Username is mandatory", status: "failed" });
  } else {
    const isDuplicateUsername = await User.findOne({ username });
    if (isDuplicateUsername) {
      return res
        .status(400)
        .json({ message: "User already exists", status: "failed" });
    }

    const isDuplicateEmail = await User.findOne({ email });
    if (isDuplicateEmail) {
      return res
        .status(400)
        .json({ message: "Email already exists", status: "failed" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({
        email,
        username,
        password: hashedPassword,
      });
      const jwtToken = jsonwebtoken.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
      );
      return res
        .status(201)
        .json({
          email: user.email,
          username: user.email,
          token: jwtToken,
          status: "success",
        });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal Server Error", status: "failed" });
    }
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // check email and password exist
  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is mandatory for login", status: "failed" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ message: "Password is mandatory for login", status: "failed" });
  }

  // check that user exists
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res
      .status(404)
      .json({ message: "Email not found", status: "failed" });
  }

  // check that password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json({ message: "Incorrect Password", status: "failed" });
  } else {
    // password is correct at this point so creating a jwt
    const jwtToken = jsonwebtoken.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );
    return res.status(200).json({ token: jwtToken, status: "sucess" });
  }
});

module.exports = router;
