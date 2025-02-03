const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
    program: { type: String, required: true },
    semester: { type: String, required: true },
    reviewerName: { type: String },
    checklist: [
        {
            category: { type: String },  // e.g., "Course Planning", "Assessment"
            items: [
                {
                    question: { type: String },  // e.g., "Are the course learning outcomes defined?"
                    status: { type: String, enum: ["Yes", "No", "N/A"] },
                    remarks: { type: String }
                }
            ]
        }
    ]
}, { timestamps: true });

const ReportModel = mongoose.model("Report", ReportSchema);

module.exports = ReportModel;
