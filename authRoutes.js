const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const router = express.Router();

function createToken(studentId) {
  return jwt.sign(
    { id: studentId },
    process.env.JWT_SECRET || "development_secret_change_me",
    { expiresIn: "1d" }
  );
}

function setTokenCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000
  });
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter your name, email and password." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must contain at least 6 characters." });
    }

    const existing = await Student.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await Student.create({ name, email, password: hashedPassword });
    setTokenCookie(res, createToken(student._id));
    res.status(201).json({ message: "Account created successfully.", student: publicStudent(student) });
  } catch (error) {
    res.status(500).json({ message: "Could not create account.", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email: (email || "").toLowerCase().trim() });
    if (!student || !(await bcrypt.compare(password || "", student.password))) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }
    setTokenCookie(res, createToken(student._id));
    res.json({ message: "Login successful.", student: publicStudent(student) });
  } catch (error) {
    res.status(500).json({ message: "Could not log in.", error: error.message });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully." });
});

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not logged in." });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "development_secret_change_me");
    const student = await Student.findById(decoded.id);
    if (!student) return res.status(401).json({ message: "Account not found." });
    res.json({ student: publicStudent(student) });
  } catch (error) {
    res.status(401).json({ message: "Please log in again." });
  }
});

function publicStudent(student) {
  const data = student.toObject();
  delete data.password;
  return data;
}

module.exports = router;
