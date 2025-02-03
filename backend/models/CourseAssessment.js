const mongoose = require('mongoose');

const CourseAssessmentSchema = new mongoose.Schema({

    teaching: { type: mongoose.Schema.Types.ObjectId, ref: 'Teaching', required: true },
    prerequisites: [
        {
            question: { type: String, required: true },
            value: { type: String, required: true },
        },
    ],
    outcomes: [
        {
            outcome: { type: String, required: true },
            howAssessed: { type: String, required: true },
            minPass: { type: String, required: true },
            highScore: { type: String, required: true },
            classAvg: { type: String, required: true },
            grade: { type: String, required: true },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('CourseAssessment', CourseAssessmentSchema);
