document.addEventListener("DOMContentLoaded", () => {
    const userData = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!userData) {
        window.location.href = "login.html";
    }

    document.getElementById("username").textContent = userData.firstName;

    if (userData.role === "admin") {
        console.log("Admin detected:", userData.email); // Debugging
        document.getElementById("admin-panel-card").style.display = "block";
        document.getElementById("admin-panel-nav").style.display = "inline-block";
    }
});

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}
