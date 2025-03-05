document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the signed-in accounts from the MSAL instance.
    const accounts = window.msalInstance.getAllAccounts();
    if (!accounts || accounts.length === 0) {
        window.location.href = "/pages/login.html";
        return;
    }
    
    const user = accounts[0];
    let displayName = user.name;
    if (!displayName && user.idTokenClaims) {
        displayName = user.idTokenClaims.name || user.idTokenClaims.given_name || "User";
    }
    const usernameElement = document.getElementById("username");
    if (usernameElement) {
        usernameElement.textContent = displayName;
    }
    
    if (user.idTokenClaims && user.idTokenClaims.role === "admin") {
        const adminPanelCard = document.getElementById("admin-panel-card");
        const adminPanelNav = document.getElementById("admin-panel-nav");
        if (adminPanelCard) { adminPanelCard.style.display = "block"; }
        if (adminPanelNav) { adminPanelNav.style.display = "inline-block"; }
    }
    
    // Expose a global logout function with debug logging.
    window.logout = function () {
        console.log("Logout clicked");
        window.location.href = "/pages/login.html";
    };
});
