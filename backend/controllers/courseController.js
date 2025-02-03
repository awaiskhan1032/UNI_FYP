const Class = require("../models/Class");
const Course = require("../models/Course");
const CourseAssessment = require("../models/CourseAssessment");
const CourseLog = require("../models/CourseLog");
const ReportModel = require("../models/Report");
const Session = require("../models/Session");
const Teaching = require("../models/Teaching");
const User = require("../models/User");

// Get courses for a specific class
exports.getCoursesForClass = async (req, res) => {
  try {
    const { className } = req.body;
    const courses = await Course.find({ class: className });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
};

// Update course description
exports.updateCourseDescription = async (req, res) => {
  try {
    const { courseTitle, ...courseData } = req.body;
    const courseName = courseTitle.trim();
    const updatedCourse = await Course.findOneAndUpdate(
      { courseTitle: courseName }, // Find course by title
      courseData, // Update with new data
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving course description", error });
  }
};
exports.submitCourseLog = async (req, res) => {
  try {
    const {
      coursename,
      instructorname,
      classname,
      session, // Contains the log entries with date, duration, topic, evaluation, signature
    } = req.headers;

    const { logEntries, catalogNumber } = req.body;

    const sessionSplitted = session.split(" ");
    const year = sessionSplitted[0];
    const batch = sessionSplitted[1];

    // Find the instructor (teacher)
    const teacher = await User.findOne({
      name: instructorname,
      role: "teacher",
    });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const courseTitle = coursename.trim();

    // Find the course
    const course = await Course.findOne({ courseTitle });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const parts = classname.split(" ");
    const discipline = parts[0]; // SE
    const semester = parseInt(parts[1], 10); // 1
    const section = parts[2]; // A

    // Find the class entry
    const classEntry = await Class.findOne({ discipline, section, semester });
    if (!classEntry) {
      return res.status(404).json({ message: "Class not found" });
    }

    const batchValue = batch.toLowerCase();
    // Find or create the session entry
    let sessionEntry = await Session.findOne({ year, session: batchValue });
    if (!sessionEntry) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Find the teaching entry
    const teaching = await Teaching.findOne({
      teacher: teacher._id,
      class: classEntry._id,
      session: sessionEntry._id,
      courses: course._id,
    });

    if (!teaching) {
      return res.status(404).json({ message: "Teaching entry not found" });
    }

    // Loop through log entries and create CourseLog entries for each one
    const courseLogs = []; 

    for (const log of logEntries) {
      console.log(log);
      // Check if a CourseLog already exists with the same teaching and date
      let existingCourseLog = await CourseLog.findOne({
        teaching: teaching._id,
        date: log.date,
      });

      if (existingCourseLog) {
        // If the log exists, update the fields
        existingCourseLog.duration = log.duration;
        existingCourseLog.topic = log.topic;
        existingCourseLog.evaluationInstrument = log.evaluationInstrument;
        existingCourseLog.signature = log.signature;

        // Save the updated CourseLog
        await existingCourseLog.save();
        courseLogs.push(existingCourseLog);
      } else {
        // If the log doesn't exist, create a new CourseLog
        const newCourseLog = new CourseLog({
          teaching: teaching._id,
          date: log.date,
          duration: log.duration,
          topic: log.topic,
          evaluationInstrument: log.evaluationInstrument,
          signature: log.signature,
        });

        // Save the new CourseLog
        const savedCourseLog = await newCourseLog.save();
        courseLogs.push(savedCourseLog);
      }
    }

    res.status(201).json({
      message: "Course logs submitted successfully",
      courseLogs,
    });
  } catch (error) {
    console.error("Error submitting course logs:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
exports.getCourseLogs = async (req, res) => {
  try {
    const { coursename, instructorname, classname, session } = req.headers;

    // Split session into year and batch
    const sessionSplitted = session.split(" ");
    const year = sessionSplitted[0];
    const batch = sessionSplitted[1];

    // Find the instructor (teacher)
    const teacher = await User.findOne({
      name: instructorname,
      role: "teacher",
    });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Find the course
    const course = await Course.findOne({ courseTitle: coursename.trim() });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const parts = classname.split(" ");
    const discipline = parts[0]; // SE
    const semester = parseInt(parts[1], 10); // 1
    const section = parts[2]; // A

    // Find the class entry
    const classEntry = await Class.findOne({ discipline, section, semester });
    if (!classEntry) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Find or create the session entry
    let sessionEntry = await Session.findOne({
      year,
      session: batch.toLowerCase(),
    });
    if (!sessionEntry) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Find the teaching entry
    const teaching = await Teaching.findOne({
      teacher: teacher._id,
      class: classEntry._id,
      session: sessionEntry._id,
      courses: course._id,
    });

    if (!teaching) {
      return res.status(404).json({ message: "Teaching entry not found" });
    }

    // Fetch course logs related to this teaching entry
    const courseLogs = await CourseLog.find({ teaching: teaching._id })
      .select("date duration topic evaluationInstrument signature") // Select the necessary fields

    // Respond with the logs
    res.status(200).json({
      message: "Course logs fetched successfully",
      logEntries: courseLogs,
    });
  } catch (error) {
    console.error("Error fetching course logs:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.submitOutcomeAssessment = async (req, res) => {
  try {
    const {
      batch,
      year,
      courseName,
      instructorName,
      className,
      prerequisites,
      outcomes,
    } = req.body;

    // Find the instructor (teacher)
    const teacher = await User.findOne({
      name: instructorName,
      role: "teacher",
    });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const courseTitle = courseName.trim();

    // Find the course
    const course = await Course.findOne({ courseTitle });
    if (!course) {
      console.log("course not found");

      return res.status(404).json({ message: "Course not found" });
    }

    const parts = className.split(" ");

    const discipline = parts[0]; // SE
    const semester = parseInt(parts[1], 10); // 1
    const section = parts[2]; // A

    // Find the class entry
    const classEntry = await Class.findOne({ discipline, section, semester });
    if (!classEntry) {
      return res.status(404).json({ message: "Class not found" });
    }
    const batchValue = batch.toLowerCase();
    // Find or create the session entry
    let sessionEntry = await Session.findOne({ year, session: batchValue });
    if (!sessionEntry) {
      return res.status(404).json({ message: "session not found" });
    }

    // Find the teaching entry
    const teaching = await Teaching.findOne({
      teacher: teacher._id,
      class: classEntry._id,
      session: sessionEntry._id,
      courses: course._id,
    });

    if (!teaching) {
      return res.status(404).json({ message: "Teaching entry not found" });
    }

    // Create a new CourseLog entry
    const CourseAssessments = await CourseAssessment.findOneAndUpdate(
      { teaching: teaching._id }, // Find based on teaching ID
      {
        teaching: teaching._id,
        prerequisites,
        outcomes,
      },
      { upsert: true, new: true } // Upsert ensures creation if not found
    );

    await CourseAssessments.save();

    res.status(201).json({
      message: "Course Assessment submitted successfully",
      CourseAssessments,
    });
  } catch (error) {
    console.error("Error submitting course Assessment:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
// GET: Check if data exists
exports.getOutcomeAssessment = async (req, res) => {
  try {
    const { batch, year, courseName, instructorName, className } = req.query;

    const teacher = await User.findOne({
      name: instructorName,
      role: "teacher",
    });
    if (!teacher) {
      console.log("teacher not found");
      return res.status(404).json({ message: "Teacher not found" });
    }

    const courseTitle = courseName.trim();

    // Find the course
    const course = await Course.findOne({ courseTitle });
    if (!course) {
      console.log("course not found");

      return res.status(404).json({ message: "Course not found" });
    }

    const parts = className.split(" ");

    const discipline = parts[0]; // SE
    const semester = parseInt(parts[1], 10); // 1
    const section = parts[2]; // A

    // Find the class entry
    const classEntry = await Class.findOne({ discipline, section, semester });
    if (!classEntry) {
      console.log("class not found");

      return res.status(404).json({ message: "Class not found" });
    }
    const batchValue = batch.toLowerCase();
    // Find or create the session entry
    let sessionEntry = await Session.findOne({ year, session: batchValue });
    if (!sessionEntry) {
      console.log("session not found");

      return res.status(404).json({ message: "session not found" });
    }

    // Find the teaching entry
    const teaching = await Teaching.findOne({
      teacher: teacher._id,
      class: classEntry._id,
      session: sessionEntry._id,
      courses: course._id,
    });

    if (!teaching) {
      console.log("teaching not found");

      return res.status(404).json({ message: "Teaching entry not found" });
    }
    // Validate input
    if (!batch || !year || !courseName || !instructorName) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // Check if the data exists
    const existingLog = await CourseAssessment.findOne({ teaching });
    if (existingLog) {
      return res.status(200).json(existingLog);
    } else {
      console.log("no course assessment not found");
      return res.status(404).json({ message: "No existing data found" });
    }
  } catch (error) {
    console.error("Error fetching course log:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getReportByCourseTitle = async (req, res) => {
  try {
    const { coursename, instructorname, classname, session } = req.headers;

    const sessionSplitted = session.split(" ");
    const year = sessionSplitted[0];
    const batch = sessionSplitted[1];

    // Find the instructor (teacher)
    const teacher = await User.findOne({
      name: instructorname,
      role: "teacher",
    });
    if (!teacher) {
      console.log("Teacher not found");

      return res.status(404).json({ message: "Teacher not found" });
    }

    // Find the course
    const course = await Course.findOne({ courseTitle: coursename.trim() });
    if (!course) {
      console.log("Course not found");

      return res.status(404).json({ message: "Course not found" });
    }

    const parts = classname.split(" ");
    const discipline = parts[0]; // SE
    const semester = parseInt(parts[1], 10); // 1
    const section = parts[2]; // A

    // Find the class entry
    const classEntry = await Class.findOne({ discipline, section, semester });
    if (!classEntry) {
      console.log("Class not found");

      return res.status(404).json({ message: "Class not found" });
    }

    // Find or create the session entry
    let sessionEntry = await Session.findOne({
      year,
      session: batch.toLowerCase(),
    });
    if (!sessionEntry) {
      console.log("Session not found");

      return res.status(404).json({ message: "Session not found" });
    }

    // Find the teaching entry
    const teaching = await Teaching.findOne({
      teacher: teacher._id,
      class: classEntry._id,
      session: sessionEntry._id,
      courses: course._id,
    });

    if (!teaching) {
      console.log("Teaching not found");

      return res.status(404).json({ message: "Teaching entry not found" });
    }

    const report = await ReportModel.findOne({ courseTitle: coursename });

    if (!report) {
      console.log("Report not found");
      return res.status(404).json({ message: "Report not found." });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.saveOrUpdateReport = async (req, res) => {
  try {
    const {
      reviewerName,
      checklist,
      coursename,
      instructorname,
      classname,
      session,
    } = req.body;

    const sessionSplitted = session.split(" ");
    const year = sessionSplitted[0];
    const batch = sessionSplitted[1];

    // Find the instructor (teacher)
    const teacher = await User.findOne({
      name: instructorname,
      role: "teacher",
    });
    if (!teacher) {
      console.log("Teacher not found");

      return res.status(404).json({ message: "Teacher not found" });
    }

    const courseTitle = coursename.trim();

    // Find the course
    const course = await Course.findOne({ courseTitle });
    if (!course) {
      console.log("Course not found");

      return res.status(404).json({ message: "Course not found" });
    }

    const parts = classname.split(" ");
    const discipline = parts[0]; // SE
    const semester = parseInt(parts[1], 10); // 1
    const section = parts[2]; // A

    // Find the class entry
    const classEntry = await Class.findOne({ discipline, section, semester });
    if (!classEntry) {
      console.log("Class not found");

      return res.status(404).json({ message: "Class not found" });
    }

    const batchValue = batch.toLowerCase();
    // Find or create the session entry
    let sessionEntry = await Session.findOne({ year, session: batchValue });
    if (!sessionEntry) {
      console.log("Session not found");

      return res.status(404).json({ message: "Session not found" });
    }

    // Find the teaching entry
    const teaching = await Teaching.findOne({
      teacher: teacher._id,
      class: classEntry._id,
      session: sessionEntry._id,
      courses: course._id,
    });

    if (!teaching) {
      console.log("Teaching not found");

      return res.status(404).json({ message: "Teaching entry not found" });
    }

    // Check if report exists
    let report = await ReportModel.findOne({ courseTitle });
    const program = discipline;
    if (report) {
      // Update existing report
      report.program = program;
      report.semester = semester;
      report.instructorName = instructorName;
      report.reviewerName = reviewerName;
      report.checklist = checklist;
    } else {
      // Create new report
      report = new ReportModel({
        program,
        semester,
        reviewerName,
        checklist,
      });
    }

    await report.save();
    res.status(200).json({ message: "Report saved successfully.", report });
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
