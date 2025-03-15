document.addEventListener("DOMContentLoaded", () => {
    // Get the signed-in account from MSAL
    // Use an empty array as fallback instead of null to avoid redirection
    const accounts = window.msalInstance ? window.msalInstance.getAllAccounts() : [];
    
    // If no account is signed in, use default values (e.g., Guest)
    const user = accounts.length > 0 ? accounts[0] : { idTokenClaims: {} };
    const claims = user.idTokenClaims || {};
    
    // Set default values if claims are missing
    const displayName = claims.name || claims.given_name || "Guest";
    const firstName = claims.given_name || "Guest";
    const lastName = claims.family_name || "";
    
    // Update profile page elements with user info
    document.getElementById("profile-display-name").textContent = displayName;
    document.getElementById("profile-name").textContent = `${firstName} ${lastName}`;
    document.getElementById("profile-role").textContent = claims.role === "admin" ? "👑 Administrator" : "👤 Member";
    
    // For the profile picture, check for a claim (if provided) or use a default image.
    const defaultProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    const profilePic = claims.picture || defaultProfilePic;
    document.getElementById("profile-img").src = profilePic;

    // Open Edit Profile Modal
    window.openEditModal = function () {
        document.getElementById("edit-profile-modal").style.display = "flex";
        document.getElementById("edit-display-name").value = displayName;
        document.getElementById("edit-first-name").value = firstName;
        document.getElementById("edit-last-name").value = lastName;
        // Load stored bio (if any) from localStorage
        const storedBio = localStorage.getItem("profileBio") || "";
        document.getElementById("edit-bio").value = storedBio;
    };

    // Close the Edit Profile Modal
    window.closeEditModal = function () {
        document.getElementById("edit-profile-modal").style.display = "none";
    };

    // Save Profile Changes locally (if desired)
    window.saveProfileChanges = function () {
        const newDisplayName = document.getElementById("edit-display-name").value.trim();
        const newFirstName = document.getElementById("edit-first-name").value.trim();
        const newLastName = document.getElementById("edit-last-name").value.trim();
        const newBio = document.getElementById("edit-bio").value.trim();
        
        // Save the new bio locally (MSAL tokens are read-only)
        localStorage.setItem("profileBio", newBio);
        
        // Update UI with new changes
        document.getElementById("profile-display-name").textContent = newDisplayName || displayName;
        document.getElementById("profile-name").textContent = `${newFirstName || firstName} ${newLastName || lastName}`;
        document.getElementById("profile-bio").textContent = newBio || "No bio added.";
        
        closeEditModal();
    };
});
