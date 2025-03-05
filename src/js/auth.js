import { PublicClientApplication } from "@azure/msal-browser";

// Azure AD B2C policies and authorities using your tenant values
const b2cPolicies = {
  names: {
    signUpSignIn: "B2C_1_SignUpSignIn",       // Your sign-up/sign-in policy
    resetPassword: "B2C_1_PasswordReset"        // Your password reset policy
  },
  authorities: {
    signUpSignIn: {
      authority: "https://nahstempleton.b2clogin.com/nahstempleton.onmicrosoft.com/B2C_1_SignUpSignIn"
    },
    resetPassword: {
      authority: "https://nahstempleton.b2clogin.com/nahstempleton.onmicrosoft.com/B2C_1_PasswordReset"
    }
  }
};

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: "b7a36819-669e-4e93-aced-c649a19194ae", // Your B2C Application (client) ID
    authority: b2cPolicies.authorities.signUpSignIn.authority, // Default sign-in policy
    knownAuthorities: ["nahstempleton.b2clogin.com"],
    redirectUri: window.location.hostname === "localhost"
        ? "http://localhost:3000/auth/callback"
        : "https://nahstempleton-dkdufadccvhne6br.westus2-01.azurewebsites.net/auth/redirect", // Production redirect URI (ensure this is registered)
    postLogoutRedirectUri: window.location.hostname === "localhost"
        ? "http://localhost:3000/login.html"
        : "https://nahstempleton-dkdufadccvhne6br.westus2-01.azurewebsites.net/login.html"
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false
  }
};

// Create MSAL instance and expose it globally
const msalInstance = new PublicClientApplication(msalConfig);
window.msalInstance = msalInstance;

// Define login request parameters
const loginRequest = {
  scopes: ["openid", "offline_access"]
};

// Define password reset request parameters (using the password reset policy)
const passwordResetRequest = {
  authority: b2cPolicies.authorities.resetPassword.authority,
  scopes: ["openid"]
};

// Helper: Update UI with signed-in user info if an element with ID 'userDisplayName' exists
function updateUserDisplay(account) {
  if (!account) return;
  const name =
    (account.idTokenClaims && (account.idTokenClaims.name || account.idTokenClaims.given_name))
      ? (account.idTokenClaims.name || account.idTokenClaims.given_name)
      : account.username;
  const userSpan = document.getElementById("userDisplayName");
  if (userSpan) {
    userSpan.textContent = name;
  }
}

// Process redirect responses (for redirect flows)
msalInstance.handleRedirectPromise()
  .then((response) => {
    if (response !== null) {
      updateUserDisplay(response.account);
    } else {
      const currentAccounts = msalInstance.getAllAccounts();
      if (currentAccounts && currentAccounts.length > 0) {
        updateUserDisplay(currentAccounts[0]);
      }
    }
  })
  .catch((error) => {
    // Check if the error indicates a password reset request
    if (error.errorMessage && error.errorMessage.indexOf("AADB2C90118") > -1) {
      console.warn("Redirect login error indicates password reset. Redirecting to password reset policy...");
      msalInstance.loginRedirect(passwordResetRequest);
    } else {
      console.error("Redirect login error: ", error);
    }
  });

// Define the sign-in function
function signIn() {
  msalInstance.loginPopup(loginRequest)
    .then((response) => {
      if (response) {
        updateUserDisplay(response.account);
        window.location.href = "/pages/dashboard.html";
      }
    })
    .catch((error) => {
      // If error indicates "forgot password", trigger the password reset flow
      if (error.errorMessage && error.errorMessage.indexOf("AADB2C90118") > -1) {
        console.warn("Popup login indicates 'Forgot Password' – redirecting to Password Reset flow.");
        msalInstance.loginRedirect(passwordResetRequest);
      } else {
        console.error("Login failed: ", error);
        alert("Login failed. Please try again.");
      }
    });
}

// Define the sign-out function
function signOut() {
  msalInstance.logoutRedirect({
    postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri
  });
}

// Attach event listeners when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("loginButton");
  const signupButton = document.getElementById("signupButton");

  if (loginButton) {
    loginButton.addEventListener("click", signIn);
  }
  if (signupButton) {
    signupButton.addEventListener("click", signIn);
  }
});

// Export functions if needed (or you can attach these directly to window)
// export { msalInstance, signIn, signOut };