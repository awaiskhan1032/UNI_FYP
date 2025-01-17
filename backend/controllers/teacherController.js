const Class = require("../models/class");
const Course = require("../models/Course");
const Session = require("../models/Session");
const Teaching = require("../models/Teaching");
const User = require("../models/User");




const path = require('path');
const multer = require('multer');

// Set up storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Files will be saved in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${timestamp}${ext}`); // Custom file naming
    },
});

// Filter to accept only PDF files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

// Initialize multer with storage and file filter
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, 
}).single('file'); 

const uploadDocument = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error(err.message);
            return res.status(400).json({ message: err.message });
        }

        // File was successfully uploaded
        const filePath = req.file.path; // File path in the uploads folder
        return res.status(200).json({
            message: 'File uploaded successfully',
            filePath,
        });
    });
};


const getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" });
    res.status(200).json(teachers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
    console.log(error.message);
  }
};

const addCourse = async (req, res) => {
  const { teacher, discipline, semester, section, year, session, courses } =
    req.body;

  console.log(teacher, discipline, semester, section, year, session, courses);

  try {
    // Check or create class entry
    let classEntry = await Class.findOne({ discipline, section, semester });
    if (!classEntry) {
      classEntry = await Class.create({ discipline, section, semester });
    }

    // Check or create session entry
    let sessionEntry = await Session.findOne({ year, session });
    if (!sessionEntry) {
      sessionEntry = await Session.create({ year, session });
    }

    // Check or create course entries
    const courseEntries = [];
    for (const { courseCode, courseTitle } of courses) {
      let course = await Course.findOne({ courseTitle });
      if (!course) {
        course = await Course.create({ courseCode, courseTitle });
      }
      courseEntries.push(course._id);
    }

    // Create teaching entry
    const teaching = await Teaching.create({
      teacher,
      class: classEntry._id,
      session: sessionEntry._id,
      courses: courseEntries,
    });

    res
      .status(201)
      .json({ message: "Teaching assignment created successfully", teaching });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
    console.log(error.message);
  }
};



const getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find();
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sessions', error: error.message });
    }
};



const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find();
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching classes', error: error.message });
    }
};

module.exports = { getAllTeachers, addCourse, getAllSessions , getAllClasses ,uploadDocument  };
