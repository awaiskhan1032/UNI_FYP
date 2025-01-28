const express = require('express');
const { getAllTeachers, getAllSessions, getAllClasses, getAllCourses, getSpecificCourses } = require('../controllers/teacherController');
const { addCourse } = require('../controllers/teacherController');
const { uploadDocument, uploadLectureNotes } = require('../controllers/uploadController');
const upload = require('../middleware/multerConfig');
const multer = require('multer');
const { updateCourseDescription, downloadCourseDescription } = require('../controllers/courseController');

const router = express.Router();
const lecUpload = multer({ dest: 'uploads/lecture-notes/' });

// router.get('/dashboard', protect, getDashboardData);
router.get('/getAll', getAllTeachers);
router.post('/add-course', addCourse);
router.get('/session/getAll', getAllSessions);
router.get('/class/getAll', getAllClasses );
router.get('/course/getAll', getAllCourses );
router.post('/course/get-specific', getSpecificCourses );
// Route to update course description
router.post('/course/update-description', updateCourseDescription);

// Route to download course description
router.post('/cours/download-description', downloadCourseDescription);
router.post('/document', upload.single('file'), uploadDocument);
router.post('/lecture-notes/document', lecUpload.single('file'), uploadLectureNotes);

module.exports = router;
