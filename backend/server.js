const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teacher');
const manageLoginsRoutes=require("./routes/manageLogins")
const cors = require('cors');
const { uploadDocument } = require('./controllers/uploadController');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/manage-logins', manageLoginsRoutes);

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
