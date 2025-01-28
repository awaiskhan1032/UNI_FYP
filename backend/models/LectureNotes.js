const mongoose = require('mongoose');

const LectureNotesSchema = new mongoose.Schema({
  week: {
    type: Number,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  documentPath: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('LectureNotes', LectureNotesSchema);
