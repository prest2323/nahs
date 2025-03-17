document.addEventListener("DOMContentLoaded", async () => {
    console.log("🔍 Loading profile page...");

    // Default profile picture
    const defaultProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    try {
        // Fetch user details from backend session
        const response = await fetch("http://localhost:3000/auth/user", { credentials: "include" });

        if (!response.ok) {
            throw new Error(`Failed to fetch user data: ${response.status}`);
        }

        const user = await response.json();

        // If user is not authenticated, redirect to login
        if (!user || user.error) {
            console.warn("⚠️ User not authenticated.");
            window.location.href = "/pages/login.html";
            return;
        }

        console.log("✅ User authenticated:", user);

        // Extract user details
        const firstName = user.firstName || "Guest";
        const lastName = user.lastName || "";
        const defaultDisplayName = `${firstName} ${lastName}`.trim();
        const storedDisplayName = localStorage.getItem("profileDisplayName") || defaultDisplayName;
        const email = user.email || "No Email";
        const storedProfilePic = localStorage.getItem("profilePic") || user.picture || defaultProfilePic;

        // Update profile UI elements
        document.getElementById("profile-display-name").textContent = storedDisplayName;
        document.getElementById("profile-first-name").textContent = firstName;
        document.getElementById("profile-last-name").textContent = lastName;
        document.getElementById("profile-email").textContent = email;
        document.getElementById("profile-img").src = storedProfilePic;

        // Load stored bio (if any) from localStorage
        const storedBio = localStorage.getItem("profileBio") || "No bio added.";
        document.getElementById("profile-bio").textContent = storedBio;

        // Handle profile picture upload
        document.getElementById("upload-profile-pic").addEventListener("change", function (event) {
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const newProfilePic = e.target.result;
                    document.getElementById("profile-img").src = newProfilePic;
                    localStorage.setItem("profilePic", newProfilePic); // Save to local storage
                };
                reader.readAsDataURL(file);
            }
        });

        // Open Edit Profile Modal
        window.openEditModal = function () {
            document.getElementById("edit-profile-modal").style.display = "flex";
            document.getElementById("edit-display-name").value = storedDisplayName;
            document.getElementById("edit-first-name").value = firstName;
            document.getElementById("edit-last-name").value = lastName;
            document.getElementById("edit-bio").value = storedBio;
        };

        // Close the Edit Profile Modal
        window.closeEditModal = function () {
            document.getElementById("edit-profile-modal").style.display = "none";
        };

        // Save Profile Changes locally
        window.saveProfileChanges = function () {
            const newDisplayName = document.getElementById("edit-display-name").value.trim();
            const newFirstName = document.getElementById("edit-first-name").value.trim();
            const newLastName = document.getElementById("edit-last-name").value.trim();
            const newBio = document.getElementById("edit-bio").value.trim();

            // Save the new display name and bio locally
            localStorage.setItem("profileDisplayName", newDisplayName || defaultDisplayName);
            localStorage.setItem("profileBio", newBio);

            // Update UI with new changes
            document.getElementById("profile-display-name").textContent = newDisplayName || defaultDisplayName;
            document.getElementById("profile-first-name").textContent = newFirstName || firstName;
            document.getElementById("profile-last-name").textContent = newLastName || lastName;
            document.getElementById("profile-bio").textContent = newBio || "No bio added.";

            closeEditModal();
        };

    } catch (error) {
        console.error("❌ Error loading profile:", error);
        alert("⚠️ Error loading profile. Redirecting to login.");
        window.location.href = "/pages/login.html";
    }
});
