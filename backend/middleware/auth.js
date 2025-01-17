const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Attach user info to request
        next(); // Continue to the next middleware/controller
    } catch (err) {
        res.status(401).json({ message: 'Not authorized, invalid token' });
    }
};

module.exports = protect;
