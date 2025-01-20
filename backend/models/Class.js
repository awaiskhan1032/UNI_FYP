const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    discipline: String,
    semester: String,
    section: String,
});

module.exports = mongoose.models.Class || mongoose.model('Class', classSchema);
