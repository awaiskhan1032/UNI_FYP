const express = require('express');
const { getAllTeachers, getAllSessions, getAllClasses, getAllCourses, getSpecificCourses } = require('../controllers/teacherController');
const { addCourse } = require('../controllers/teacherController');
const { uploadDocument, uploadLectureNotes } = require('../controllers/uploadController');
const upload = require('../middleware/multerConfig');
const multer = require('multer');

const router = express.Router();
const lecUpload = multer({ dest: 'uploads/lecture-notes/' });

// router.get('/dashboard', protect, getDashboardData);
router.get('/getAll', getAllTeachers);
router.post('/add-course', addCourse);
router.get('/session/getAll', getAllSessions);
router.get('/class/getAll', getAllClasses );
router.get('/course/getAll', getAllCourses );
router.post('/course/get-specific', getSpecificCourses );
router.post('/document', upload.single('file'), uploadDocument);
router.post('/lecture-notes/document', lecUpload.single('file'), uploadLectureNotes);

module.exports = router;
