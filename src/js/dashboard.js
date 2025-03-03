document.addEventListener("DOMContentLoaded", () => {
    const userData = JSON.parse(localStorage.getItem("loggedInUser"));

    // If the user isn't logged in, redirect to the login page
    if (!userData) {
        window.location.href = "/pages/login.html";
        return;
    }

    // Update the username display, if the element exists
    const usernameElement = document.getElementById("username");
    if (usernameElement) {
        usernameElement.textContent = userData.firstName;
    }

    // If the logged-in user is an admin, display the admin panel sections
    if (userData.role === "admin") {
        console.log("Admin detected:", userData.email);
        const adminPanelCard = document.getElementById("admin-panel-card");
        const adminPanelNav = document.getElementById("admin-panel-nav");

        if (adminPanelCard) {
            adminPanelCard.style.display = "block";
        }
        if (adminPanelNav) {
            adminPanelNav.style.display = "inline-block";
        }
    }
});

// Logout function that clears the user data and redirects to login page
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/pages/login.html";
}
