const express = require('express');
const { signup, login } = require('../controllers/authController');
const protect = require('../middleware/auth');
const router = express.Router();

// Signup API
router.post('/signup', signup);

// Login API
router.post('/login', login);
router.post('/validate-token', protect, (req, res) => {
    res.status(200).json({ message: 'Token is valid' });
});

module.exports = router;
