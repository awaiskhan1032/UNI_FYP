const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
    {
        path: {
            type: String,
            required: true,
        },
        doctype:{
            type: String,
            required: true,
        },
        subtype:{
            type: String,
        },
        teaching: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teaching',
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
