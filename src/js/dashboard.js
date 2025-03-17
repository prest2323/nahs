document.addEventListener("DOMContentLoaded", async () => {
    console.log("Checking user authentication...");

    try {
        // Fetch user details from backend session
        const response = await fetch("http://localhost:3000/auth/user", { credentials: "include" });

        // If server is down or request fails, handle gracefully
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }

        const user = await response.json();

        // If user is not authenticated, redirect to login **ONLY if not already there**
        if (!user || user.error) {
            console.log("User not authenticated.");

            // Prevent infinite loop by checking if already on login page
            if (window.location.pathname !== "/pages/login.html") {
                console.log("Redirecting to login...");
                window.location.href = "/pages/login.html";
            }
            return;
        }

        console.log("User authenticated:", user);

        // Get user display name (Google OAuth provides given_name, family_name, and email)
        const displayName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email || "User";

        // Update the username display
        const usernameElement = document.getElementById("username");
        if (usernameElement) {
            usernameElement.textContent = displayName;
        }

        // Check if the user has an "admin" role (This should be handled properly in backend)
        if (user.role === "admin") {
            const adminPanelCard = document.getElementById("admin-panel-card");
            const adminPanelNav = document.getElementById("admin-panel-nav");
            if (adminPanelCard) adminPanelCard.style.display = "block";
            if (adminPanelNav) adminPanelNav.style.display = "inline-block";
        }

    } catch (error) {
        console.error("Error fetching user data:", error);

        // Only redirect if NOT already on login page (to avoid infinite loop)
        if (window.location.pathname !== "/pages/login.html") {
            alert("Error fetching user data. Redirecting to login.");
            window.location.href = "/pages/login.html";
        }
    }
});
