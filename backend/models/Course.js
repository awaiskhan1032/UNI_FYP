const mongoose = require('mongoose');

// Define the weekly topic schema
const weeklyTopicSchema = new mongoose.Schema({
    week: { type: Number, required: true },
    lectures: { type: [String], required: true }
});

// Define the course schema
const courseSchema = new mongoose.Schema({
    courseCode: { type: String },
    courseTitle: { type: String, required: true },
    creditHours: { type: String },
    prerequisites: { type: String },
    assessmentInstruments: { type: String },
    courseCoordinator: { type: String},
    url: { type: String},
    catalogDescription: { type: String},
    textbook: { type: String },
    referenceMaterial: { type: String },
    courseGoals: { type: String},
    weeklyTopics: [weeklyTopicSchema],
    // Reference to the Class model
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }
});

// Export the Course model, ensuring it's only created once.
module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);
