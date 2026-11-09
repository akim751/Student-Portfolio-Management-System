const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  qualification: { type: String, trim: true },
  institution: { type: String, trim: true },
  year: { type: String, trim: true },
  grade: { type: String, trim: true }
});

const projectSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  technologies: { type: String, trim: true },
  link: { type: String, trim: true }
});

const achievementSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  date: { type: String, trim: true }
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  headline: { type: String, default: "" },
  phone: { type: String, default: "" },
  location: { type: String, default: "" },
  about: { type: String, default: "" },
  education: [educationSchema],
  skills: [{ type: String, trim: true }],
  projects: [projectSchema],
  achievements: [achievementSchema]
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
