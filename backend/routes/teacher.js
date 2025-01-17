const express = require('express');
const { getAllTeachers, getAllSessions, getAllClasses } = require('../controllers/teacherController');
const { addCourse } = require('../controllers/teacherController');
const { uploadDocument } = require('../controllers/uploadController');
const upload = require('../middleware/multerConfig');

const router = express.Router();

// router.get('/dashboard', protect, getDashboardData);
router.get('/getAll', getAllTeachers);
router.post('/add-course', addCourse);
router.get('/session/getAll', getAllSessions);
router.get('/class/getAll', getAllClasses );
router.post('/document', upload.single('file'), uploadDocument);

module.exports = router;
