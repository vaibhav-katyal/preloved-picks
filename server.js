require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Ensure MONGO_URI is provided
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error("Error: MONGO_URI is not defined in .env");
    process.exit(1); // Stop execution if URI is missing
}

// Connect to MongoDB with proper options
mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Stop execution if MongoDB fails
    });

// Define user schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Ensure JWT_SECRET is provided
if (!process.env.JWT_SECRET) {
    console.error("Error: JWT_SECRET is not defined in .env");
    process.exit(1);
}

// Generate example JWT token
const exampleToken = jwt.sign({ userId: "12345" }, process.env.JWT_SECRET, { expiresIn: "1h" });
console.log("🔑 Example JWT Token:", exampleToken);
console.log("🔒 JWT Secret:", process.env.JWT_SECRET);

// User signup route
app.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if email already exists
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password and save user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// User login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        // Compare hashed password
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { username: user.username, email: user.email } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
