const mongoose = require('mongoose');

const TeachingSchema = new mongoose.Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],

});
module.exports = mongoose.model('Teaching', TeachingSchema);