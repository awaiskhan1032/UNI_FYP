const Course = require("../models/Course");
const Session = require("../models/Session");
const Teaching = require("../models/Teaching");
const User = require("../models/User");


const Class = require("../models/Class");




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

  // console.log(teacher, discipline, semester, section, year, session, courses);

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
    
    for (const {courseTitle} of courses) {
      let course = await Course.findOne({ courseTitle, class: classEntry._id }); // Check if course exists for the class
      if (!course) {
        course = await Course.create({ courseTitle, class: classEntry._id });
      }
      courseEntries.push(course._id);
    }

    // Check if teaching entry exists
    let teaching = await Teaching.findOne({
      teacher,
      class: classEntry._id,
      session: sessionEntry._id,
    });

    if (teaching) {
      // Update existing teaching entry with new courses
      teaching.courses = [...new Set([...teaching.courses, ...courseEntries])]; // Avoid duplicate courses
      await teaching.save();

      return res
        .status(200)
        .json({ message: "Teaching entry updated with new courses", teaching });
    }

    // Create a new teaching entry if it doesn't exist
    teaching = await Teaching.create({
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

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
};
const getSpecificCourses = async (req, res) => {
  try {
    const { class: classValue } = req.body;
    

    const [discipline, semester, section] = classValue.split(' ');

    const classEntry = await Class.findOne({ discipline, semester, section });
    if (!classEntry) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Fetch courses related to the class
    const courses = await Course.find({ class: classEntry._id });

    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error.message);
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

module.exports = { getAllTeachers, addCourse, getAllSessions , getAllClasses,getAllCourses , getSpecificCourses  };
