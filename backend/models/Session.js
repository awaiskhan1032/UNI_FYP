const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({

    year: { type: Number, required: true },
    session: { type: String, required: true },
});
module.exports = mongoose.model('Session', SessionSchema);