document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        window.location.href = "login.html"; // Redirect if not logged in
        return;
    }

    const defaultProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    // Load Profile Info
    document.getElementById("profile-display-name").textContent = loggedInUser.displayName || "No Display Name";
    document.getElementById("profile-name").textContent = `${loggedInUser.firstName} ${loggedInUser.lastName}`;
    document.getElementById("profile-role").textContent = loggedInUser.role === "admin" ? "👑 Administrator" : "👤 Member";
    document.getElementById("profile-bio").textContent = loggedInUser.bio || "No bio added.";
    document.getElementById("profile-img").src = loggedInUser.profilePic || defaultProfilePic;

    // Handle Profile Picture Upload (Live Preview & Save)
    document.getElementById("upload-profile-pic").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("profile-img").src = e.target.result;
                loggedInUser.profilePic = e.target.result;
                localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
                localStorage.setItem(loggedInUser.email, JSON.stringify(loggedInUser));
                updateMembersList(); // Update member list
            };
            reader.readAsDataURL(file);
        }
    });

    // Open Edit Profile Modal
    window.openEditModal = function () {
        document.getElementById("edit-profile-modal").style.display = "flex";
        document.getElementById("edit-display-name").value = loggedInUser.displayName || "";
        document.getElementById("edit-first-name").value = loggedInUser.firstName;
        document.getElementById("edit-last-name").value = loggedInUser.lastName;
        document.getElementById("edit-bio").value = loggedInUser.bio || "";
    };

    // Close Modal
    window.closeEditModal = function () {
        document.getElementById("edit-profile-modal").style.display = "none";
    };

    // Save Profile Changes
    window.saveProfileChanges = function () {
        loggedInUser.displayName = document.getElementById("edit-display-name").value.trim();
        loggedInUser.firstName = document.getElementById("edit-first-name").value.trim();
        loggedInUser.lastName = document.getElementById("edit-last-name").value.trim();
        loggedInUser.bio = document.getElementById("edit-bio").value.trim();

        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        localStorage.setItem(loggedInUser.email, JSON.stringify(loggedInUser));

        // Update UI
        document.getElementById("profile-display-name").textContent = loggedInUser.displayName || "No Display Name";
        document.getElementById("profile-name").textContent = `${loggedInUser.firstName} ${loggedInUser.lastName}`;
        document.getElementById("profile-bio").textContent = loggedInUser.bio || "No bio added.";

        updateMembersList(); // Reflect changes in members list
        closeEditModal();
    };

    // Function to update member list live when profile updates
    function updateMembersList() {
        const profilePic = loggedInUser.profilePic || defaultProfilePic;
        document.querySelectorAll(".member-pic").forEach(img => {
            if (img.dataset.email === loggedInUser.email) {
                img.src = profilePic;
            }
        });

        document.querySelectorAll(".member-display-name").forEach(name => {
            if (name.dataset.email === loggedInUser.email) {
                name.textContent = loggedInUser.displayName || loggedInUser.firstName;
            }
        });

        document.querySelectorAll(".member-real-name").forEach(realName => {
            if (realName.dataset.email === loggedInUser.email) {
                realName.textContent = `${loggedInUser.firstName} ${loggedInUser.lastName}`;
            }
        });
    }
});
