require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");

// Initialize App
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://prestonlukensgames:<your_password>@cluster0.9exi5.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../pages"))); // Serve HTML files
app.use(express.static(path.join(__dirname, "../css"))); // Serve CSS
app.use(express.static(path.join(__dirname, "../js"))); // Serve JS

// Connect to MongoDB
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// User Schema & Model
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    displayName: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "member" }, // "admin" or "member"
    profilePic: { type: String, default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" },
    bio: { type: String, default: "" },
    stars: { type: Number, default: 0 },
    lightning: { type: Number, default: 0 }
});

const User = mongoose.model("User", userSchema);

// Helper Function: Generate JWT Token
const generateToken = (user) => {
    return jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "2h" });
};

// 🔹 **User Registration**
app.post("/api/signup", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, email, password: hashedPassword });
        await newUser.save();

        res.json({ success: true, message: "Account created successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Server error." });
    }
});

// 🔹 **User Login**
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid email or password." });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: "Invalid email or password." });

        const token = generateToken(user);
        res.json({ success: true, token, user });
    } catch (error) {
        res.status(500).json({ error: "Server error." });
    }
});

// 🔹 **Get All Members (For Enrolled Members Page)**
app.get("/api/members", async (req, res) => {
    try {
        const users = await User.find({}, "-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users." });
    }
});

// 🔹 **Update Profile (Display Name, Bio, Profile Pic)**
app.post("/api/profile/update", async (req, res) => {
    const { email, displayName, firstName, lastName, bio, profilePic } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { email },
            { displayName, firstName, lastName, bio, profilePic },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: "User not found." });
        res.json({ success: true, message: "Profile updated successfully!", user });
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile." });
    }
});

// 🔹 **Admin: Update Stars & Lightning**
app.post("/api/rating/update", async (req, res) => {
    const { email, stars, lightning } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { email },
            { stars: Math.min(5, Math.max(0, stars)), lightning: Math.min(5, Math.max(0, lightning)) },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: "User not found." });
        res.json({ success: true, message: "Rating updated successfully!", user });
    } catch (error) {
        res.status(500).json({ error: "Failed to update rating." });
    }
});

// 🔹 **Redirect Root to Dashboard if Logged In**
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/login.html"));
});

// 🔹 **Start Server**
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
