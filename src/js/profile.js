document.addEventListener("DOMContentLoaded", () => {
    // Get the signed-in account from MSAL
    const accounts = window.msalInstance ? window.msalInstance.getAllAccounts() : null;
    if (!accounts || accounts.length === 0) {
        // No signed-in account found – redirect to login page.
        window.location.href = "/pages/login.html";
        return;
    }
    
    // Use the first account (adjust if you support multiple accounts)
    const user = accounts[0];
    
    // Retrieve user attributes from the ID token claims
    const claims = user.idTokenClaims || {};
    
    // Determine display name (fallback to given name if necessary)
    const displayName = claims.name || claims.given_name || "User";
    const firstName = claims.given_name || "";
    const lastName = claims.family_name || "";
    
    // Update profile page elements with user info
    document.getElementById("profile-display-name").textContent = displayName;
    document.getElementById("profile-name").textContent = `${firstName} ${lastName}`;
    document.getElementById("profile-role").textContent = claims.role === "admin" ? "👑 Administrator" : "👤 Member";
    
    // For the profile picture, check for a claim (if provided) or use a default image.
    const defaultProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    const profilePic = claims.picture || defaultProfilePic;
    document.getElementById("profile-img").src = profilePic;

    // If you still need local editing capabilities, you may opt to sync these changes to localStorage.
    // However, for a MSAL-based flow, consider retrieving fresh values from your back-end or B2C custom attributes.
    
    // The following code remains for handling profile edits locally.
    // Open Edit Profile Modal
    window.openEditModal = function () {
        document.getElementById("edit-profile-modal").style.display = "flex";
        document.getElementById("edit-display-name").value = displayName;
        document.getElementById("edit-first-name").value = firstName;
        document.getElementById("edit-last-name").value = lastName;
        // For bio, if you're storing it separately (e.g., in localStorage), load it here.
        const storedBio = localStorage.getItem("profileBio") || "";
        document.getElementById("edit-bio").value = storedBio;
    };

    // Close the Edit Profile Modal
    window.closeEditModal = function () {
        document.getElementById("edit-profile-modal").style.display = "none";
    };

    // Save Profile Changes locally (if desired)
    window.saveProfileChanges = function () {
        // Here you could update a localStorage key for the bio or other editable fields.
        const newDisplayName = document.getElementById("edit-display-name").value.trim();
        const newFirstName = document.getElementById("edit-first-name").value.trim();
        const newLastName = document.getElementById("edit-last-name").value.trim();
        const newBio = document.getElementById("edit-bio").value.trim();
        
        // Save the new bio locally (since MSAL tokens are read-only, you cannot update them on the client)
        localStorage.setItem("profileBio", newBio);
        
        // Update UI with new changes
        document.getElementById("profile-display-name").textContent = newDisplayName || displayName;
        document.getElementById("profile-name").textContent = `${newFirstName || firstName} ${newLastName || lastName}`;
        document.getElementById("profile-bio").textContent = newBio || "No bio added.";
        
        // Optionally, update other parts of your app that rely on this info.
        closeEditModal();

    };

    // Optionally, you could also update the member list (if you have one) using similar logic.
});
