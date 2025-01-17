const { default: mongoose } = require("mongoose");
const Document = require("../models/Document");

exports.uploadDocument = async (req, res) => {
  const teachingId = "64a76e00b123456789abcd"; // Replace this with dynamic teaching ID later

  try {
    const document = await Document.create({
      path: req.file.path,
      teaching: new mongoose.Types.ObjectId(teachingId),
    });

    res.status(201).json({
      message: "File uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("Error saving document:", error.message);
    res
      .status(500)
      .json({ message: "Error saving document", error: error.message });
  }
};
