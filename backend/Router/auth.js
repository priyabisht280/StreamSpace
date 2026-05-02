require("dotenv").config();
require("../Database/database");
const express = require("express");
const bcrypt = require("bcrypt");
const userData = require("../Models/user");
const auth = express.Router();
const nodemailer = require("nodemailer");

// Helper function to verify user credentials (replaces token verification)
const verifyUser = async (email, password) => {
  try {
    const user = await userData.findOne({ email });
    if (!user) return null;
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    return isValidPassword ? user : null;
  } catch (error) {
    return null;
  }
};

auth.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await userData.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "USER ALREADY EXISTS",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 11);
    const saveData = new userData({
      name,
      email,
      password: hashedPassword,
    });
    await saveData.save();

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: "admin@shubho.youtube.app",
      to: email,
      subject: "Welcome to Shubho's YouTube Clone!",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <h1 style="color: #333;">Welcome to Shubho's YouTube Clone!</h1>
          <p style="color: #555;">Hello ${name},</p>
          <p style="color: #555;">We are excited to have you as a new member of our community! Thank you for joining.</p>
          <p style="color: #555;">Feel free to explore our platform and start sharing your videos with the world.</p>
          <p style="color: #555;">If you have any questions or need assistance, don't hesitate to reach out to us.</p>
          <p style="color: #555;">Best regards,</p>
          <p style="color: #555;">Shubhojeet Bera</p>
        </div>
      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(400).json({
          success: false,
          message: "Error sending email",
        });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({
          success: true,
          message: "Registration mail sent to your email",
        });
      }
    });

    res.status(201).json({
      message: "REGISTRATION SUCCESSFUL",
      user: { name, email } // Return user data instead of tokens
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

auth.post("/login", async (req, res) => {
  try {
    const { email1, password1 } = req.body;

    const user = await userData.findOne({ email: email1 });
    if (!user) {
      return res.status(404).json({
        message: "USER DOESN'T EXIST",
      });
    }

    const checkPassword = await bcrypt.compare(password1, user.password);
    if (checkPassword) {
      return res.status(200).json({
        message: "LOGIN SUCCESSFUL",
        user: { id: user._id, name: user.name, email: user.email } // Return user data
      });
    } else {
      res.status(401).json({
        message: "INVALID CREDENTIALS",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

auth.post("/resetlink", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userData.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "USER DOESN'T EXIST",
      });
    }

    // Generate simple random reset code instead
    const resetCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetLink = `${process.env.BACKEND_URL}/reset-password?email=${email}&code=${resetCode}`;

    // Store reset code in user document (you'll need to add this field to your User model)
    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: "admin@shubho.youtube.app",
      to: email,
      subject: "Password Reset Link",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <h2 style="color: #333;">Password Reset</h2>
          <p style="color: #555;">Hello,</p>
          <p style="color: #555;">Click the following link to reset your password:</p>
          <p style="margin: 20px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          </p>
          <p style="color: #555;">This link is only valid for 30 minutes.</p>
          <p style="color: #555;">If you didn't request a password reset, please ignore this email.</p>
          <p style="color: #888;">Best regards,<br/>Shubhojeet Bera</p>
        </div>
      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(400).json({
          message: "Error sending email",
        });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({
          message: "Password reset link sent to your email",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

auth.post("/userdata", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const user = await verifyUser(email, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const userData = await userData.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = auth;
