document.addEventListener("DOMContentLoaded", async () => {
    console.log("🔍 Loading members...");

    const membersList = document.getElementById("members-list");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    // Redirect to login if no user is logged in
    if (!loggedInUser) {
        window.location.href = "/pages/login.html";
        return;
    }

    // Default Profile Picture
    const defaultProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    // Function to load members from localStorage
    function loadMembers() {
        membersList.innerHTML = ""; // Clear list

        let foundUsers = false;

        // Iterate over localStorage keys to find members
        Object.keys(localStorage).forEach((key) => {
            if (key.includes("@")) { // Ensure key is an email
                const userData = JSON.parse(localStorage.getItem(key));
                if (userData) {
                    foundUsers = true;

                    const profilePic = userData.profilePic || defaultProfilePic;
                    const displayName = userData.displayName || `${userData.firstName} ${userData.lastName}`;
                    const stars = Math.min(5, Math.max(0, parseInt(localStorage.getItem(`stars_${userData.email}`) || "0")));
                    const lightning = Math.min(5, Math.max(0, parseInt(localStorage.getItem(`lightning_${userData.email}`) || "0")));

                    // Create a member card
                    const memberItem = document.createElement("div");
                    memberItem.classList.add("member-item");
                    memberItem.innerHTML = `
                        <div class="member-info">
                            <img class="member-pic" data-email="${userData.email}" src="${profilePic}" alt="Profile Picture">
                            <div class="member-details">
                                <p class="member-display-name" data-email="${userData.email}">${displayName}</p>
                                <p class="member-real-name">(${userData.firstName} ${userData.lastName})</p>
                                <p class="member-role ${userData.role === 'admin' ? 'admin-badge' : 'member-badge'}">
                                    ${userData.role === 'admin' ? '👑 Administrator' : '🏅 Member'}
                                </p>
                                <p class="member-stars" data-email="${userData.email}">⭐ ${stars}</p>
                                <p class="member-lightning" data-email="${userData.email}">⚡ ${lightning}</p>

                                ${loggedInUser.role === 'admin' ? `
                                    <div class="admin-controls">
                                        <button onclick="adjustStars('${userData.email}', 1)">⭐ +1</button>
                                        <button onclick="adjustStars('${userData.email}', -1)">⭐ -1</button>
                                        <button onclick="adjustLightning('${userData.email}', 1)">⚡ +1</button>
                                        <button onclick="adjustLightning('${userData.email}', -1)">⚡ -1</button>
                                    </div>
                                ` : ""}
                            </div>
                        </div>
                    `;

                    membersList.appendChild(memberItem);
                }
            }
        });

        if (!foundUsers) {
            membersList.innerHTML = `<p class="no-members">No registered members yet.</p>`;
        }
    }

    // Load members on page load
    loadMembers();
});

// Adjust Stars (Admin Only)
window.adjustStars = function(email, change) {
    let stars = parseInt(localStorage.getItem(`stars_${email}`) || "0");
    stars = Math.min(5, Math.max(0, stars + change));
    localStorage.setItem(`stars_${email}`, stars);
    updateMemberUI(email);
};

// Adjust Lightning (Admin Only)
window.adjustLightning = function(email, change) {
    let lightning = parseInt(localStorage.getItem(`lightning_${email}`) || "0");
    lightning = Math.min(5, Math.max(0, lightning + change));
    localStorage.setItem(`lightning_${email}`, lightning);
    updateMemberUI(email);
};

// Live Update Function to refresh UI
function updateMemberUI(email) {
    const defaultProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    const userData = JSON.parse(localStorage.getItem(email));

    if (userData) {
        document.querySelectorAll(`.member-pic[data-email="${email}"]`).forEach(img => {
            img.src = userData.profilePic || defaultProfilePic;
        });

        document.querySelectorAll(`.member-display-name[data-email="${email}"]`).forEach(name => {
            name.textContent = userData.displayName || `${userData.firstName} ${userData.lastName}`;
        });

        document.querySelectorAll(`.member-stars[data-email="${email}"]`).forEach(starEl => {
            let stars = Math.min(5, Math.max(0, parseInt(localStorage.getItem(`stars_${email}`) || "0")));
            starEl.textContent = `⭐ ${stars}`;
        });

        document.querySelectorAll(`.member-lightning[data-email="${email}"]`).forEach(lightningEl => {
            let lightning = Math.min(5, Math.max(0, parseInt(localStorage.getItem(`lightning_${email}`) || "0")));
            lightningEl.textContent = `⚡ ${lightning}`;
        });
    }
}
