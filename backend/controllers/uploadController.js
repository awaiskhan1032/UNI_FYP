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
exports.uploadLectureNotes = async (req, res) => {
    const { week, courseTitle } = req.body;
    const courseName = courseTitle.trim();  
  
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    try {
      // Check if course exists
      const course = await Course.findOne({ 
        courseTitle: { $regex: `^${courseName}$`, $options: 'i' } // Case-insensitive match
      });
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // Create new lecture notes entry
      const lectureNotes = await LectureNotes.create({
        week,
        course: course._id,
        documentPath: req.file.path,
      });
  
      res.status(201).json({
        message: 'Lecture notes uploaded successfully',
        lectureNotes,
      });
    } catch (error) {
      console.error('Error uploading lecture notes:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

  exports.uploadDocument = async (req, res) => {
    const {
        class: classValue,
        teacher: teacherName,
        session: sessionValue,
        course: courseValue,
        subtype
    } = req.headers;
      
    const { doctype } = req.body; // Retrieve doctype from FormData

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
            console.log("class not found")
            return res.status(404).json({ message: "Class not found" });
        }
       
        // Fetch teacher ID
        const teacher = await User.findOne({ name: teacherName, role: "teacher" });
        if (!teacher) {
            console.log("teacher not found")

            return res.status(404).json({ message: "Teacher not found" });
        }

        // Fetch session ID
        const sessionEntry = await Session.findOne({ year, session });
        if (!sessionEntry) {
            console.log("session not found")

            return res.status(404).json({ message: "Session not found" });
        }

        const courseEntry = await Course.findOne({ courseTitle: courseValue });
        if (!courseEntry) {
            console.log("course not found")

            return res.status(404).json({ message: "Course not found" });
        }

        const teaching = await Teaching.findOne({
            class: classEntry._id,
            teacher: teacher._id,
            session: sessionEntry._id,
        });
    
        if (!teaching) {
            console.log("teaching entry not found")

            return res.status(404).json({ message: "Teaching entry not found" });
        }

        // Prepare document payload
        const documentPayload = {
            path: req.file.path,
            teaching: teaching._id,
            course: courseEntry._id,
            doctype, // Save doctype in the document
        };

        // Include subtype if present
        if (subtype) {
            documentPayload.subtype = subtype;
        }

        // Save the document in the Document model
        const document = await Document.create(documentPayload);

        res.status(201).json({
            message: "File uploaded successfully",
            document,
        });
    } catch (error) {
        console.error("Error saving document:", error.message);
        res.status(500).json({ message: "Error saving document", error: error.message });
    }
};


// Export middleware to handle file uploads
exports.upload = upload.single("file");
