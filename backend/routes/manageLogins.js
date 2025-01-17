const express = require('express');
const { generateLogins } = require('../controllers/authController');
const router = express.Router();

router.post('/generate', generateLogins);

module.exports = router;
