const mongoose = require('mongoose');

// Define the weekly topic schema
const weeklyTopicSchema = new mongoose.Schema({
    week: { type: Number, required: true },
    lectures: { type: [String], required: true }
});

// Define the course schema
const courseSchema = new mongoose.Schema({
    courseCode: { type: String, required: true },
    courseTitle: { type: String, required: true },
    creditHours: { type: String, required: true },
    prerequisites: { type: String, required: true },
    assessmentInstruments: { type: String, required: true },
    courseCoordinator: { type: String, required: true },
    url: { type: String, required: true },
    catalogDescription: { type: String, required: true },
    textbook: { type: String, required: true },
    referenceMaterial: { type: String, required: true },
    courseGoals: { type: String, required: true },
    weeklyTopics: [weeklyTopicSchema],
    // Reference to the Class model
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }
});

// Export the Course model, ensuring it's only created once.
module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);
