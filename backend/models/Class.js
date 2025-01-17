const mongoose = require('mongoose');

// Models
const ClassSchema = new mongoose.Schema({
    discipline: { type: String, required: true },
    section: { type: String, required: true },
    semester: { type: String, required: true },
});

module.exports= mongoose.model('Class', ClassSchema);