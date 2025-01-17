const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    courseCode: { type: String, required: true },
    courseTitle: { type: String, required: true },
});
module.exports = mongoose.model('Course', CourseSchema);