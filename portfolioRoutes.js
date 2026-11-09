const express = require("express");
const Student = require("../models/Student");
const requireAuth = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

async function getStudent(req) {
  return Student.findById(req.studentId);
}

router.get("/", async (req, res) => {
  try {
    const student = await getStudent(req);
    if (!student) return res.status(404).json({ message: "Student not found." });
    const data = student.toObject();
    delete data.password;
    res.json({ student: data });
  } catch (error) {
    res.status(500).json({ message: "Could not load portfolio." });
  }
});

router.put("/profile", async (req, res) => {
  try {
    const { name, headline, phone, location, about } = req.body;
    const student = await getStudent(req);
    if (!student) return res.status(404).json({ message: "Student not found." });
    if (name) student.name = name;
    student.headline = headline || "";
    student.phone = phone || "";
    student.location = location || "";
    student.about = about || "";
    await student.save();
    res.json({ message: "Profile updated.", student });
  } catch (error) {
    res.status(500).json({ message: "Could not update profile." });
  }
});

router.post("/education", async (req, res) => {
  try {
    const student = await getStudent(req);
    student.education.push(req.body);
    await student.save();
    res.status(201).json({ message: "Education added.", education: student.education });
  } catch (error) {
    res.status(500).json({ message: "Could not add education." });
  }
});

router.put("/education/:id", async (req, res) => {
  try {
    const student = await getStudent(req);
    const item = student.education.id(req.params.id);
    if (!item) return res.status(404).json({ message: "Education record not found." });
    Object.assign(item, req.body);
    await student.save();
    res.json({ message: "Education updated.", education: student.education });
  } catch (error) {
    res.status(500).json({ message: "Could not update education." });
  }
});

router.delete("/education/:id", async (req, res) => {
  try {
    const student = await getStudent(req);
    student.education.pull(req.params.id);
    await student.save();
    res.json({ message: "Education deleted." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete education." });
  }
});

router.post("/skills", async (req, res) => {
  try {
    const student = await getStudent(req);
    const skill = (req.body.skill || "").trim();
    if (!skill) return res.status(400).json({ message: "Enter a skill." });
    if (!student.skills.includes(skill)) student.skills.push(skill);
    await student.save();
    res.status(201).json({ message: "Skill added.", skills: student.skills });
  } catch (error) {
    res.status(500).json({ message: "Could not add skill." });
  }
});

router.delete("/skills/:index", async (req, res) => {
  try {
    const student = await getStudent(req);
    const index = Number(req.params.index);
    if (!Number.isInteger(index) || index < 0 || index >= student.skills.length) {
      return res.status(404).json({ message: "Skill not found." });
    }
    student.skills.splice(index, 1);
    await student.save();
    res.json({ message: "Skill deleted.", skills: student.skills });
  } catch (error) {
    res.status(500).json({ message: "Could not delete skill." });
  }
});

router.post("/projects", async (req, res) => {
  try {
    const student = await getStudent(req);
    student.projects.push(req.body);
    await student.save();
    res.status(201).json({ message: "Project added.", projects: student.projects });
  } catch (error) {
    res.status(500).json({ message: "Could not add project." });
  }
});

router.put("/projects/:id", async (req, res) => {
  try {
    const student = await getStudent(req);
    const item = student.projects.id(req.params.id);
    if (!item) return res.status(404).json({ message: "Project not found." });
    Object.assign(item, req.body);
    await student.save();
    res.json({ message: "Project updated.", projects: student.projects });
  } catch (error) {
    res.status(500).json({ message: "Could not update project." });
  }
});

router.delete("/projects/:id", async (req, res) => {
  try {
    const student = await getStudent(req);
    student.projects.pull(req.params.id);
    await student.save();
    res.json({ message: "Project deleted." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete project." });
  }
});

router.post("/achievements", async (req, res) => {
  try {
    const student = await getStudent(req);
    student.achievements.push(req.body);
    await student.save();
    res.status(201).json({ message: "Achievement added.", achievements: student.achievements });
  } catch (error) {
    res.status(500).json({ message: "Could not add achievement." });
  }
});

router.put("/achievements/:id", async (req, res) => {
  try {
    const student = await getStudent(req);
    const item = student.achievements.id(req.params.id);
    if (!item) return res.status(404).json({ message: "Achievement not found." });
    Object.assign(item, req.body);
    await student.save();
    res.json({ message: "Achievement updated.", achievements: student.achievements });
  } catch (error) {
    res.status(500).json({ message: "Could not update achievement." });
  }
});

router.delete("/achievements/:id", async (req, res) => {
  try {
    const student = await getStudent(req);
    student.achievements.pull(req.params.id);
    await student.save();
    res.json({ message: "Achievement deleted." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete achievement." });
  }
});

module.exports = router;
