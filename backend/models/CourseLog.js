const mongoose = require('mongoose');

const courseLogSchema = new mongoose.Schema({
    teaching: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teaching',
    },
    date: {
        type: Date,
    },
    duration: {
        type: String,  // You can change this to a number if needed
    },
    topic: {
        type: String,
    },
    evaluationInstrument: {
        type: String,
    },
    signature: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.models.CourseLog || mongoose.model('CourseLog', courseLogSchema);
