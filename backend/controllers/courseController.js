const Course = require("../models/Course");

// Get courses for a specific class
exports.getCoursesForClass = async (req, res) => {
    try {
        const { className } = req.body;
        const courses = await Course.find({ class: className });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error });
    }
};

// Update course description
exports.updateCourseDescription = async (req, res) => {
    try {
        const { courseId, ...courseData } = req.body;
        const updatedCourse = await Course.findByIdAndUpdate(courseId, courseData, { new: true });
        res.status(200).json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: 'Error saving course description', error });
    }
};

// Download course description (Here we are just sending the data back as JSON, you can enhance it to generate a PDF)
exports.downloadCourseDescription = async (req, res) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // For simplicity, we're sending the course data as JSON here
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error generating download', error });
    }
};
