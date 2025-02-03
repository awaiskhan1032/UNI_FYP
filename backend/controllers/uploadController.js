const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const Document = require("../models/Document");
const Class = require("../models/Class");
const Session = require("../models/Session");
const Teaching = require("../models/Teaching");
const User = require("../models/User");
const Course = require("../models/Course");
const LectureNotes = require("../models/LectureNotes");

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// controllers/lectureNotesController.js
// exports.uploadLectureNotes = async (req, res) => {
//   const { week, courseTitle } = req.body;
//   const courseName = courseTitle.trim();

//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   try {
//     // Check if course exists
//     const course = await Course.findOne({
//       courseTitle: { $regex: `^${courseName}$`, $options: "i" }, // Case-insensitive match
//     });

//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     // Create new lecture notes entry
//     const lectureNotes = await LectureNotes.create({
//       week,
//       course: course._id,
//       documentPath: req.file.path,
//     });

//     res.status(201).json({
//       message: "Lecture notes uploaded successfully",
//       lectureNotes,
//     });
//   } catch (error) {
//     console.error("Error uploading lecture notes:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

exports.uploadDocument = async (req, res) => {
  const {
    class: classValue,
    teacher: teacherName,
    session: sessionValue,
    course: courseValue,
  } = req.headers;

  const { doctype, week, subtype } = req.body; // Retrieve doctype from FormData
  console.log(classValue, teacherName, sessionValue, courseValue);

  if (!doctype) {
    return res.status(400).json({ message: "Doctype is required." });
  }

  try {
    // Parse classValue into discipline, semester, and section
    const [discipline, semester, section] = classValue.split(" ");

    // Parse sessionValue into session and year
    const [year, session] = sessionValue.split(" ");

    // Fetch class ID
    const classEntry = await Class.findOne({ discipline, semester, section });
    if (!classEntry) {
      console.log("class not found");
      return res.status(404).json({ message: "Class not found" });
    }

    // Fetch teacher ID
    const teacher = await User.findOne({ name: teacherName, role: "teacher" });
    if (!teacher) {
      console.log("teacher not found");
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Fetch session ID
    const sessionEntry = await Session.findOne({ year, session });
    if (!sessionEntry) {
      console.log("session not found");
      return res.status(404).json({ message: "Session not found" });
    }

    const courseEntry = await Course.findOne({ courseTitle: courseValue });
    if (!courseEntry) {
      console.log("course not found");
      return res.status(404).json({ message: "Course not found" });
    }

    const teaching = await Teaching.findOne({
      class: classEntry._id,
      teacher: teacher._id,
      session: sessionEntry._id,
    });

    if (!teaching) {
      console.log("teaching entry not found");
      return res.status(404).json({ message: "Teaching entry not found" });
    }

    // Check if a document with similar entries exists
    let document = await Document.findOne({
      teaching: teaching._id,
      course: courseEntry._id,
      doctype,
      ...(subtype && { subtype }), // Only add subtype if it's present
      ...(week && { week }), // Only add week if it's present
    });

  
    if (document) {
      // Update the existing document
      document.path = req.file.path;
      document.updatedAt = new Date(); // Optional: update timestamp
      await document.save();

      return res.status(200).json({
        message: "File updated successfully",
        document,
      });
    } else {
      // Prepare document payload for new entry
      const documentPayload = {
        path: req.file.path,
        teaching: teaching._id,
        course: courseEntry._id,
        doctype,
        ...(subtype && { subtype }), // Include subtype if present
        ...(week && { week }), // Include week if present
      };

      // Save the new document
      document = await Document.create(documentPayload);

      return res.status(201).json({
        message: "File uploaded successfully",
        document,
      });
    }
  } catch (error) {
    console.error("Error saving document:", error.message);
    res
      .status(500)
      .json({ message: "Error saving document", error: error.message });
  }
};

exports.checkDocument = async (req, res) => {
  try {
    const {
      className,
      sessionValue,
      courseName,
      instructorName,
      doctype,
      week,
      subtype
    } = req.body;
    // console.log(className, sessionValue, courseName, instructorName);

    // Parse class details (discipline, semester, section)
    const [discipline, semester, section] = className.split(" ");

    // Parse session details (year, session)
    const [year, session] = sessionValue.split(" ");

    // Find class entry
    const classEntry = await Class.findOne({ discipline, semester, section });
    if (!classEntry) {
      console.log("Class not found");

      return res.status(404).json({ message: "Class not found" });
    }

    // Find session entry
    const sessionEntry = await Session.findOne({ year, session });
    if (!sessionEntry) {
      console.log("Session not found");

      return res.status(404).json({ message: "Session not found" });
    }

    // Find teacher (case-insensitive)
    const teacher = await User.findOne({
      name: instructorName,
      role: "teacher",
    });
    if (!teacher) {
      console.log("Teacher not found");

      return res.status(404).json({ message: "Teacher not found" });
    }
    const courseTitle = courseName.trim();
    // Find course
    const course = await Course.findOne({ courseTitle });
    if (!course) {
      console.log("Course not found");

      return res.status(404).json({ message: "Course not found" });
    }

    // Find teaching entry
    const teaching = await Teaching.findOne({
      teacher: teacher._id,
      class: classEntry._id,
      session: sessionEntry._id,
      courses: course._id,
    });

    if (!teaching) {
      console.log("Teaching entry not found");
      return res.status(404).json({ message: "Teaching entry not found" });
    }

    // Find document associated with the teaching entry and course
    const query = {
      teaching: teaching._id,
      course: course._id,
      doctype: doctype,
    };

    // Add week condition only if week is not null
    if (week) {
      query.week = week;
    }
    if (subtype) {
      query.subtype = subtype;
    }

    const document = await Document.findOne(query);

    if (!document) {
      console.log("Document not found");
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json({ message: "Document found", document });
  } catch (error) {
    console.error("Error retrieving document:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Export middleware to handle file uploads
exports.upload = upload.single("file");
