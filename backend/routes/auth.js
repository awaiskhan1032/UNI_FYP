const express = require('express');
const { signup, login, getUsers, updateUserPassword, deleteUser } = require('../controllers/authController');
const protect = require('../middleware/auth');
const router = express.Router();

// Signup API
router.post('/signup', signup);

// Login API
router.post('/login', login);
router.get('/users',getUsers)
router.post("/:id/update-password", updateUserPassword);
router.delete("/:userId", deleteUser);


router.post('/validate-token', protect, (req, res) => {
    res.status(200).json({ message: 'Token is valid' });
});

module.exports = router;
