document.addEventListener("DOMContentLoaded", async () => {
    console.log("🔍 Auth script loaded...");

    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");

    // Redirect to Google Sign-In
    if (loginButton) {
        loginButton.addEventListener("click", () => {
            console.log("🔗 Redirecting to Google Sign-In...");
            window.location.href = "http://localhost:3000/auth/google";
        });
    }

    // Logout function
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            console.log("🚪 Logging out...");
            localStorage.removeItem("user"); // Remove user data from local storage
            window.location.href = "http://localhost:3000/logout"; // Logout route
        });
    }

    // Function to fetch and store user details
    async function fetchUserDetails() {
        try {
            const response = await fetch("http://localhost:3000/auth/user", { credentials: "include" });

            // Check if response is successful
            if (!response.ok) {
                throw new Error(`Failed to fetch user data: ${response.status}`);
            }

            const user = await response.json();

            // If user is not authenticated, redirect to login (Only if not already there)
            if (!user || user.error) {
                console.warn("⚠️ User not authenticated.");
                if (window.location.pathname !== "/pages/login.html") {
                    console.log("🔀 Redirecting to login...");
                    window.location.href = "/pages/login.html";
                }
                return;
            }

            console.log("✅ User authenticated:", user);

            // Store user info in local storage
            localStorage.setItem("user", JSON.stringify(user));

            // Extract user details
            const firstName = user.firstName || "Unknown First Name";
            const lastName = user.lastName || "Unknown Last Name";
            const email = user.email || "Unknown Email";

            console.log(`👤 First Name: ${firstName}`);
            console.log(`👤 Last Name: ${lastName}`);
            console.log(`📧 Email: ${email}`);

            // Display user info in the UI
            const usernameElement = document.getElementById("username");
            if (usernameElement) {
                usernameElement.textContent = `${firstName} ${lastName}`;
            }

            // Redirect user to dashboard (Only if not already there)
            if (window.location.pathname === "/pages/login.html") {
                console.log("🔀 Redirecting to dashboard...");
                window.location.href = "/pages/dashboard.html";
            }

        } catch (error) {
            console.error("❌ Error fetching user details:", error);

            // Redirect to login ONLY if NOT already on login page (Prevents infinite loop)
            if (window.location.pathname !== "/pages/login.html") {
                alert("⚠️ Error fetching user data. Redirecting to login.");
                window.location.href = "/pages/login.html";
            }
        }
    }

    // Check if user is already logged in from local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        console.log("🔄 User found in local storage:", JSON.parse(storedUser));
    } else {
        await fetchUserDetails(); // Fetch user details if not found in storage
    }
});
