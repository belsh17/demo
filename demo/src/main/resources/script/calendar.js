//functionality for highlighting active page side tab
const links = document.querySelectorAll(".tab-list a");
//const currentPath = window.location.pathname.split("/").pop(); //gets file name/html
const currentURL = window.location.href;

links.forEach(link => {
    const href = link.href;
    //const href = link.getAttribute("href");
    //if(href === currentPath){
    if(currentURL.includes(href)){
        link.classList.add("active");
    }
});
//end of side tab functionality
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

        if(!calendarEl){
            console.error("Calendar element not found");
            return;
        }

        if(window.calendarInstance){
            window.calendarInstance.destroy();
        }

        window.calendarInstance = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth, timeGridWeek,listWeek"
            },
            events: eventsFromBackend.map(e => ({
                title: e.summary,
                // || e.startDate
                // start: new Date(e.start.dateTime.value),
                start: new Date(e.start.dateTime) || e.startDate,
                end: new Date(e.end.dateTime) || e.endDate,
                description: e.description || ''
            })),
            eventDidMount: function(info){
                if(info.event.extendedProps.description){
                    info.el.setAttribute("title", info.event.extendedProps.description);
                }
            }
        });

        window.calendarInstance.render();
}

document.addEventListener("DOMContentLoaded", () => {
    if(isLinked) {
        fetchCalendarEvents();
        }   
    });