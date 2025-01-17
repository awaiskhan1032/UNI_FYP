const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
    {
        path: {
            type: String,
            required: true,
        },
        teaching: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teaching',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
