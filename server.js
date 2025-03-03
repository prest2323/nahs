const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Serve static files (HTML, CSS, JS, Images)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Redirect root "/" to login page
app.get("/", (req, res) => {
    res.redirect("/pages/login.html");
});

// ✅ Serve HTML pages dynamically
app.get("/pages/:page", (req, res) => {
    const filePath = path.join(__dirname, "public", "pages", `${req.params.page}.html`);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).sendFile(path.join(__dirname, "public", "pages", "404.html"));
    }
});

// ✅ Handle 404 errors for all other routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "public", "pages", "404.html"));
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
