const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
});

module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);
