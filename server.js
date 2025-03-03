const express = require("express");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from src/css, src/js, and src/data
app.use("/css", express.static(path.join(__dirname, "src", "css")));
app.use("/js", express.static(path.join(__dirname, "src", "js")));
app.use("/data", express.static(path.join(__dirname, "src", "data")));

// Serve HTML pages from the src/pages folder
app.use(express.static(path.join(__dirname, "src", "pages")));

// Redirect root "/" to the login page (use the correct URL)
app.get("/", (req, res) => {
    res.redirect("/login.html");
});
// Serve HTML pages dynamically from the src/pages folder
app.get("/pages/:page", (req, res) => {
    // Use the parameter as provided, so /pages/login.html resolves to src/pages/login.html
    const filePath = path.join(__dirname, "src", "pages", req.params.page);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        const errorFilePath = path.join(__dirname, "src", "pages", "404.html");
        if (fs.existsSync(errorFilePath)) {
            res.status(404).sendFile(errorFilePath);
        } else {
            res.status(404).send("404: Page not found.");
        }
    }
});

// Handle 404 errors for all other routes
app.use((req, res) => {
    const errorFilePath = path.join(__dirname, "src", "pages", "404.html");
    if (fs.existsSync(errorFilePath)) {
        res.status(404).sendFile(errorFilePath);
    } else {
        res.status(404).send("404: Page not found.");
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
