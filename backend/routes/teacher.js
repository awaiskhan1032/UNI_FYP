const express = require('express');
const { getAllTeachers, getAllSessions, getAllClasses, getAllCourses, getSpecificCourses, getCourseDescription } = require('../controllers/teacherController');
const { addCourse } = require('../controllers/teacherController');
const { uploadDocument, checkDocument } = require('../controllers/uploadController');
const upload = require('../middleware/multerConfig');
const multer = require('multer');
const { updateCourseDescription, getOutcomeAssessment, submitOutcomeAssessment, submitCourseLog, getCourseLogs, saveOrUpdateReport, getReportByCourseTitle } = require('../controllers/courseController');

const router = express.Router();
// const lecUpload = multer({ dest: 'uploads/lecture-notes/' });

// router.get('/dashboard', protect, getDashboardData);
router.get('/getAll', getAllTeachers);
router.post('/add-course', addCourse);
router.get('/session/getAll', getAllSessions);
router.get('/class/getAll', getAllClasses );
router.get('/course/getAll', getAllCourses );
router.post('/course/get-specific', getSpecificCourses );
// Route to update course descriptionq
router.post('/course/outcome-assessment', submitOutcomeAssessment );
router.post('/course/course-log', submitCourseLog );
router.get('/course/course-log', getCourseLogs );
router.get('/course/outcome-assessment', getOutcomeAssessment );
router.post('/course/update-description', updateCourseDescription);
router.get("/course/get-description", getCourseDescription);
router.get("/course/verification-report", getReportByCourseTitle);
router.post("/course/verification-report", saveOrUpdateReport);

// Route to download course description
router.post('/document', upload.single('file'), uploadDocument);
router.post('/check-document',checkDocument);
// router.post('/lecture-notes/document', lecUpload.single('file'), uploadLectureNotes);

module.exports = router;
