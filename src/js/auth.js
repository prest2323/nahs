document.addEventListener("DOMContentLoaded", () => {
    // Azure AD B2C configuration using MSAL.js
    const msalConfig = {
        auth: {
            clientId: "837001ce-1fa7-4e43-ab3d-412cd40aab76", // Replace with your Azure AD B2C Application (client) ID
            authority: "https://your-b2c-tenant.b2clogin.com/your-b2c-tenant.onmicrosoft.com/B2C_1_signupsignin", // Replace with your B2C sign-up/sign-in policy
            knownAuthorities: ["your-b2c-tenant.b2clogin.com"],
            redirectUri: window.location.origin // Or your specific redirect URI
        },
        cache: {
            cacheLocation: "localStorage", // This keeps the cache persistent across sessions
            storeAuthStateInCookie: false
        }
    };

    // Initialize MSAL instance
    const msalInstance = new msal.PublicClientApplication(msalConfig);

    // Request object for login/sign-up flows
    const authRequest = {
        scopes: ["openid", "profile"]
    };

    // Get UI elements for login and signup (ensure your HTML has these elements, e.g., buttons)
    const loginButton = document.getElementById("loginButton");
    const signupButton = document.getElementById("signupButton");

    // Handle Login
    if (loginButton) {
        loginButton.addEventListener("click", () => {
            msalInstance.loginPopup(authRequest)
                .then((loginResponse) => {
                    console.log("Login successful:", loginResponse);
                    // On successful login, redirect to dashboard or desired page.
                    window.location.href = "/pages/dashboard.html";
                })
                .catch((error) => {
                    console.error("Login error:", error);
                    alert("Login failed. Please try again.");
                });
        });
    }

    // Handle Sign-up (this example uses the same sign-up/sign-in policy)
    if (signupButton) {
        signupButton.addEventListener("click", () => {
            msalInstance.loginPopup(authRequest)
                .then((response) => {
                    console.log("Sign-up/Login successful:", response);
                    // After sign-up, you are also logged in. Redirect to dashboard.
                    window.location.href = "/pages/dashboard.html";
                })
                .catch((error) => {
                    console.error("Sign-up error:", error);
                    alert("Sign-up failed. Please try again.");
                });
        });
    }

    // Handle Logout
    window.logout = function () {
        msalInstance.logout();
    };

    // Display Logged-In User
    function displayLoggedInUser() {
        const accounts = msalInstance.getAllAccounts();
        if (accounts && accounts.length > 0) {
            const usernameElem = document.getElementById("username");
            if (usernameElem) {
                // Display the user's name from the account info
                usernameElem.textContent = accounts[0].name;
            }
        }
    }

    displayLoggedInUser();
});
