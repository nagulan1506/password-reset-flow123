const express = require('express');
const router = express.Router();
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Register Route (for testing)
router.post('/register', async (req, res) => {
  console.log("Register request received", req.body);
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).send('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).send('Error registering user');
  }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Generate random string (token)
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create link
    // Assuming frontend runs on localhost:5173 or deployed URL
    // The link should point to the Frontend Route, which then calls the Backend API
    const link = `${process.env.BASE_URL}/reset-password/${token}`;
    
    console.log("Password Reset Link:", link); // For testing purposes
    fs.writeFileSync('reset-link.txt', link); // Write to file for debugging

    await sendEmail(user.email, "Password Reset", `Click this link to reset your password: ${link}`);

    res.send('Password reset link sent to your email account');
  } catch (error) {
    res.status(500).send('An error occured');
    console.log(error);
  }
});

// Verify Token (GET)
router.get('/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) return res.status(400).send("Invalid or expired link");

    res.send("Valid link");
  } catch (error) {
    res.status(500).send("An error occured");
  }
});

// Reset Password (POST)
router.post('/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) return res.status(400).send("Invalid or expired link");

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.send("Password reset successfully");
  } catch (error) {
    res.status(500).send("An error occured");
    console.log(error);
  }
});

module.exports = router;
