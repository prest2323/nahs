document.addEventListener("DOMContentLoaded", function() {
    // Grab the necessary elements from the DOM
    const calendarGrid = document.getElementById("calendar-grid");
    const calendarMonth = document.getElementById("calendar-month");
    const eventList = document.getElementById("event-list");
    const currentDateTime = document.getElementById("current-date-time");

    // Check that essential elements exist
    if (!calendarGrid || !calendarMonth || !eventList || !currentDateTime) {
        console.error("One or more calendar elements not found in the DOM.");
        return;
    }

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    // Function to update the current date and time display
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

    // Function to render the calendar for a given month and year
    function renderCalendar(month, year) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const todayDate = new Date().getDate();
        const todayMonth = new Date().getMonth();
        const todayYear = new Date().getFullYear();

        // Display the current month and year
        calendarMonth.textContent = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });

        // Clear previous days
        calendarGrid.innerHTML = "";

        // Create and append day elements
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("calendar-day");
            dayElement.textContent = day;

            // Highlight today's date
            if (day === todayDate && month === todayMonth && year === todayYear) {
                dayElement.classList.add("today");
            }

            calendarGrid.appendChild(dayElement);
        }
    }

    // Function to load events into the event list
    function loadEvents() {
        // Clear the event list
        eventList.innerHTML = "";

        // Predefined events array
        const events = [
            { name: "🎨 Art Workshop", date: "March 5, 2025", time: "2:00 PM" },
            { name: "🖌 Mural Painting", date: "March 10, 2025", time: "3:30 PM" },
            { name: "💡 Volunteer Fair", date: "March 15, 2025", time: "10:00 AM" }
        ];

        // Add a recurring meeting every Thursday over the next 30 days
        let date = new Date();
        for (let i = 0; i < 30; i++) {
            date.setDate(date.getDate() + 1);
            if (date.getDay() === 4) { // Thursday
                events.push({ name: "📅 NAHS Weekly Meeting", date: date.toDateString(), time: "4:00 PM" });
            }
        }

        // Render each event as a list item
        events.forEach(event => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<strong>${event.name}</strong> – ${event.date} | ${event.time}`;
            eventList.appendChild(listItem);
        });
    }

    // Expose functions to navigate between months
    window.prevMonth = function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    };

    window.nextMonth = function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    };

    // Initialize calendar and events, and update the date/time display every second
    updateDateTime();
    renderCalendar(currentMonth, currentYear);
    loadEvents();
    setInterval(updateDateTime, 1000);
});
