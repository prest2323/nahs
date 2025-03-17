const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Serve static assets (CSS, JS)
app.use("/css", express.static(path.join(__dirname, "src", "css")));
app.use("/js", express.static(path.join(__dirname, "src", "js")));
app.use("/data", express.static(path.join(__dirname, "src", "data")));

// ✅ Serve HTML pages dynamically from /src/pages
app.use(express.static(path.join(__dirname, "src", "pages")));

// Redirect root "/" to login page
app.get("/", (req, res) => {
    res.redirect("/login.html");
});

// Serve specific pages dynamically
app.get("/pages/:page", (req, res) => {
    const filePath = path.join(__dirname, "src", "pages", req.params.page);
    if (path.extname(filePath) === ".html" && require("fs").existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("404: Page not found.");
    }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    console.log("🔑 Google OAuth Response:", profile);

    const adminEmails = [
        "prestonlukensgames@student.templetonusd.org",
        "prestonlukensgames@gmail.com"
    ];

    const user = {
        googleId: profile.id,
        firstName: profile.name.givenName || "Unknown",
        lastName: profile.name.familyName || "Unknown",
        email: profile.emails?.[0].value || "No Email",
        role: adminEmails.includes(profile.emails?.[0].value) ? "admin" : "member"
    };

    console.log(`✅ User authenticated: ${user.email} (Role: ${user.role})`);
    return done(null, user);
}));


// Serialize and Deserialize User
passport.serializeUser((user, done) => {
    console.log("📦 Serializing user:", user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log("📦 Deserializing user:", user);
    done(null, user);
});

// Google Authentication Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login.html" }),
    (req, res) => {
        console.log("✅ User successfully authenticated:", req.user);
        res.redirect("/dashboard.html"); // Redirect to dashboard after login
    }
);

// Get User Details
app.get("/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
        console.log("✅ User is authenticated:", req.user);
        res.json(req.user);
    } else {
        console.warn("❌ User not authenticated. Sending 401.");
        res.status(401).json({ error: "Not authenticated" });
    }
});

// Logout Route (Clears Session & Redirects)
app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("❌ Error during logout:", err);
            return res.status(500).send("Error logging out");
        }
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            console.log("🚪 User logged out successfully.");
            res.redirect("/login.html");
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
