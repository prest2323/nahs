document.addEventListener("DOMContentLoaded", function () {
    // 🌟 Get references to elements
    const calendarGrid = document.getElementById("calendar-grid");
    const calendarMonth = document.getElementById("calendar-month");
    const eventList = document.getElementById("event-list");
    const currentDateTime = document.getElementById("current-date-time");

    const eventTitleInput = document.getElementById("event-title");
    const eventOccasionInput = document.getElementById("event-occasion");
    const eventDateInput = document.getElementById("event-date");
    const addEventButton = document.getElementById("add-event-btn");

    // 🔍 Fetch logged-in user data
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        window.location.href = "/pages/login.html";
        return;
    }

    console.log("🟢 Logged-in User:", loggedInUser);
    console.log("🟠 User Role:", loggedInUser.role);

    // 🌟 Show admin panel only for admins
    if (loggedInUser.role === "admin") {
        document.getElementById("admin-panel").style.display = "block";
    }

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    // 📅 Update current date & time display
    function updateDateTime() {
        const now = new Date();
        currentDateTime.textContent = now.toLocaleString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true
        });
    }

    // 🎨 Define color mapping for event types
    const eventColors = {
        "Hours Opportunity": "#8D6E63", // Brown
        "Officer Meeting": "#D32F2F", // Red
        "General Meeting": "#388E3C", // Green
        "Event": "#1976D2" // Blue
    };

    // 📅 Render the calendar
    function renderCalendar(month, year) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        const todayDate = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();

        // 🏷 Set current month & year
        calendarMonth.textContent = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });

        // 🧹 Clear previous days
        calendarGrid.innerHTML = "";

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("calendar-day");
            dayElement.textContent = day;

            // 🟢 Highlight today's date with a green border
            if (day === todayDate && month === todayMonth && year === todayYear) {
                dayElement.classList.add("today");
            }

            // 📍 Check for events on this date
            const eventKey = `${year}-${month + 1}-${day}`;
            const storedEvents = JSON.parse(localStorage.getItem("events")) || [];

            storedEvents.forEach(event => {
                if (event.date === eventKey) {
                    let borderColor = eventColors[event.occasion] || "#D32F2F"; // Default Red

                    // 🖌 Apply event border color
                    dayElement.style.border = `3px solid ${borderColor}`;

                    // 🟢 Wrap today's date if it has an event
                    if (day === todayDate && month === todayMonth && year === todayYear) {
                        dayElement.style.boxShadow = `0 0 5px #1B5E20`;
                    }
                }
            });

            calendarGrid.appendChild(dayElement);
        }
    }

    // 📋 Load events into the event list
    function loadEvents() {
        eventList.innerHTML = "";

        const storedEvents = JSON.parse(localStorage.getItem("events")) || [];

        storedEvents.forEach((event, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <strong style="color: ${eventColors[event.occasion]}">${event.name}</strong> – ${event.date}
                <button class="delete-btn" onclick="deleteEvent(${index})">❌</button>
            `;
            eventList.appendChild(listItem);
        });
    }

    // ➕ Add a new event
    addEventButton.addEventListener("click", function () {
        const title = eventTitleInput.value.trim();
        const occasion = eventOccasionInput.value;
        const date = eventDateInput.value;

        if (!title || !date || !occasion) {
            alert("⚠️ Please fill out all fields!");
            return;
        }

        const formattedDate = date.split("-").join("-");

        const newEvent = { name: title, occasion, date: formattedDate };

        // 🌍 Save to localStorage
        const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
        storedEvents.push(newEvent);
        localStorage.setItem("events", JSON.stringify(storedEvents));

        // ✅ Refresh UI
        renderCalendar(currentMonth, currentYear);
        loadEvents();

        // 🧹 Clear input fields
        eventTitleInput.value = "";
        eventDateInput.value = "";
    });

    // 🗑 Delete an event
    window.deleteEvent = function (index) {
        let storedEvents = JSON.parse(localStorage.getItem("events")) || [];

        storedEvents.splice(index, 1);
        localStorage.setItem("events", JSON.stringify(storedEvents));

        renderCalendar(currentMonth, currentYear);
        loadEvents();
    };

    // ⏪ Navigate previous month
    window.prevMonth = function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    };

    // ⏩ Navigate next month
    window.nextMonth = function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    };

    // 🚀 Initialize everything
    updateDateTime();
    renderCalendar(currentMonth, currentYear);
    loadEvents();
    setInterval(updateDateTime, 1000);
});
