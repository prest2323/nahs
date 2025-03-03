document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");

    // Predefined Admin Accounts (Including Your Email)
    const ADMIN_ACCOUNTS = [
        "prestonlukensgames@gmail.com",
        "admin1@example.com",
        "admin2@example.com"
    ];

    // Handle Signup
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            const firstName = document.getElementById("first-name").value.trim();
            const lastName = document.getElementById("last-name").value.trim();
            const email = document.getElementById("signup-email").value.trim().toLowerCase();
            const password = document.getElementById("signup-password").value;

            if (!firstName || !lastName || !email || !password) {
                alert("Please fill out all fields.");
                return;
            }

            if (localStorage.getItem(`user_${email}`)) {
                alert("An account with this email already exists.");
                return;
            }

            const role = ADMIN_ACCOUNTS.includes(email) ? "admin" : "member";

            const userData = {
                firstName,
                lastName,
                email,
                password,
                role,
                // Use an absolute path so the image loads correctly regardless of current page
                profilePic: "/img/default-avatar.png",
                displayName: firstName // Default display name to first name
            };

            localStorage.setItem(`user_${email}`, JSON.stringify(userData));
            alert("Account created successfully! Please log in.");
            // Redirect using an absolute path to the login page
            window.location.href = "/pages/login.html";
        });
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("login-email").value.trim().toLowerCase();
            const password = document.getElementById("login-password").value;

            if (!email || !password) {
                alert("Please enter your email and password.");
                return;
            }

            const storedUser = localStorage.getItem(`user_${email}`);
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                
                if (userData.password === password) {
                    // Ensure admin role is correctly set
                    userData.role = ADMIN_ACCOUNTS.includes(email) ? "admin" : "member";
                    localStorage.setItem("loggedInUser", JSON.stringify(userData));

                    window.location.href = "/pages/dashboard.html";
                } else {
                    alert("Incorrect password.");
                }
            } else {
                alert("Account not found. Please sign up first.");
            }
        });
    }

    // Handle Logout
    window.logout = function () {
        localStorage.removeItem("loggedInUser");
        window.location.href = "/pages/login.html";
    };

    // Ensure Logged-In User is Displayed
    function displayLoggedInUser() {
        const userInfo = document.getElementById("username");
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

        if (loggedInUser && userInfo) {
            userInfo.textContent = loggedInUser.firstName;
        }
    }

    displayLoggedInUser();
});
