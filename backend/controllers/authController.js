const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../config/email");
const bcrypt = require("bcrypt");


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "please enter all fields" });
    }
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Validate password
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role ,username:user.name},
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .status(200)
      .json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserPassword = async (req, res) => {
  try {
    
      const { password } = req.body;
      
      const { id } = req.params;
      
      if (!password) {
          return res.status(400).json({ message: "Password is required" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
      console.log(user);
      
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error updating password", error: error.message });
  }
};
exports.getUsers = async (req,res)=>{
  try {
    const users = await User.find({ role: "teacher" }, "_id name email"); // Fetch only necessary fields
    const formattedUsers = users.map(user => ({
        id: user._id, // Rename _id to id
        name: user.name,
        email: user.email
    }));
    res.status(200).json(formattedUsers);
} catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
}
}
exports.deleteUser = async (req, res) => {
  
  try {
      const { userId } = req.params;

      const user = await User.findByIdAndDelete(userId);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { email, password, role, name } = req.body;
    console.log('hi');
    console.log(email, password, role, name );
    if (!email || !password || !role) {
      return res.status(400).json({ message: "please enter all fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create new user
    const user = await User.create({ name: name, email, password, role });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const generatePassword = () => {
  return crypto.randomInt(10000, 99999).toString();
};
exports.generateLogins = async (req, res) => {
  try {
    const { teacherName, email } = req.body;
    if (!teacherName || !email) {
      return res
        .status(400)
        .json({ message: "Teacher name and email are required" });
    }

    // Check if the email is already registered
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const password = generatePassword();

    user = new User({
      name: teacherName,
      email,
      password,
      role: "teacher",
    });
    await user.save();

    const subject = "Your Login Credentials";
    const text = `Dear ${teacherName},\n\nYour login credentials are as follows:\nUsername: ${email}\nPassword: ${password}\n\nThank you.`;
    await sendEmail(email, subject, text);

    res.status(201).json({
      message: "User created and credentials sent successfully",
      username: email,
      password,
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
