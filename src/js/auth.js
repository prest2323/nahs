
document.addEventListener("DOMContentLoaded", () => {
    // Determine the redirect URI based on environment:
    const redirectUri = window.location.hostname === "localhost"
        ? "http://localhost:3000/auth/callback"
        : "https://nahstempleton-dkdufadccvhne6br.westus2-01.azurewebsites.net/auth/callback"; // Replace with your production URL

    // MSAL.js configuration for Managed Azure AD B2C
    const msalConfig = {
        auth: {
            clientId: "b7a36819-669e-4e93-aced-c649a19194ae", // Your B2C Application (client) ID
            authority: "https://nahstempleton.b2clogin.com/nahstempleton.onmicrosoft.com/B2C_1_SignUpSignIn", 
            knownAuthorities: ["nahstempleton.b2clogin.com"],
            redirectUri: redirectUri // Dynamically determined redirect URI
        },
        cache: {
            cacheLocation: "localStorage",
            storeAuthStateInCookie: false
        }
    };

    // Initialize the MSAL instance
    const msalInstance = new msal.PublicClientApplication(msalConfig);

    // Expose the MSAL instance globally so other scripts can access it.
    window.msalInstance = msalInstance;

    // Handle Logout using redirect-based logout (recommended for SPAs)
    window.logout = function () {
        msalInstance.logoutRedirect();
    };

    // Request object for login/sign-up flows
    const authRequest = {
        scopes: ["openid", "profile"]
    };

    // Get references to UI elements (ensure these buttons exist in your HTML)
    const loginButton = document.getElementById("loginButton");
    const signupButton = document.getElementById("signupButton");

    // Handle Login (opens a popup for the sign-in/up flow)
    if (loginButton) {
        loginButton.addEventListener("click", () => {
            msalInstance.loginPopup(authRequest)
                .then((loginResponse) => {
                    console.log("Login successful:", loginResponse);
                    window.location.href = "/pages/dashboard.html";
                })
                .catch((error) => {
                    console.error("Login error:", error);
                    alert("Login failed. Please try again.");
                });
        });
    }

    // Handle Sign-up (using the same policy as login)
    if (signupButton) {
        signupButton.addEventListener("click", () => {
            msalInstance.loginPopup(authRequest)
                .then((response) => {
                    console.log("Sign-up/Sign-in successful:", response);
                    window.location.href = "/pages/dashboard.html";
                })
                .catch((error) => {
                    console.error("Sign-up error:", error);
                    alert("Sign-up failed. Please try again.");
                });
        });
    }
    
    // (Optional) Display the logged-in user's display name
    function displayLoggedInUser() {
        const accounts = msalInstance.getAllAccounts();
        const usernameElement = document.getElementById("username");
        if (accounts && accounts.length > 0 && usernameElement) {
            usernameElement.textContent = accounts[0].name || "User";
        }
    }
    
    displayLoggedInUser();
});
