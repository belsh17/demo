//Fetch calendar events from spring boot backend
async function fetchCalendarEvents(){
    try{
        const response = await fetch("/calendar/events");
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const events = await response.json();
        console.log("Fetched events:", events);
        renderCalendar(events);
    }catch (error){
        console.error("Error fetching events:", error);
    }
}

function renderCalendar(eventsFromBackend){
        const calendarEl = document.getElementById("calendar");

        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth, timeGridWeek,listWeek"
            },
            events: eventsFromBackend.map(e => ({
                title: e.summary,
                start: e.start.dateTime || e.start.date,
                end: e.end?.dateTime || e.end?.date || null,
                description: e.description || ''
            })),
        });

        calendar.render();
}

document.addEventListener("DOMContentLoaded", fetchCalendarEvents);