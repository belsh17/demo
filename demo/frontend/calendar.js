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
        const token = localStorage.getItem("jwt");

        const response = await fetch("http://localhost:8081/calendar/events", {
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });
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

async function getGoogleAuthUrl(){
    const token = localStorage.getItem("jwt");
    if(!token){
        alert("You need to be logged in!");
        return;
    }

    //window.location.href = `http://localhost:8081/calendar/api/google/link?token=${encodeURIComponent(token)}`;

    //window.location.href = "http://localhost:8081/calendar/api/google/link?token=" + encodeURIComponent(token);

        const response = await fetch("http://localhost:8081/calendar/api/google/link",{
            method: "GET",
            headers: {
                "Authorization" : "Bearer " + token
            }
        });
        if(!response.ok){
            console.error("Failed to get Google OAuth URL");
            return;
        }

        const googleAuthUrl = await response.text();

        //redirect to google consent page
        window.location.href = googleAuthUrl;
    
}

//document.getElementById("link-btn").addEventListener("click", getGoogleAuthUrl);

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

    //CODE FOR HIDING THE ADMIN USERS FROM SIDE TAB
        const adminTab = document.getElementById("admin-tab");
        const token = localStorage.getItem("jwt");
        if(!token){
            adminTab.style.display = "none";
            return;
        }

        const decoded = parseJwt(token);
        const roles = decoded?.roles || [];
        console.log("Decoded roles:", roles);

        const isAdmin = roles === "ADMIN" || roles === "ROLE_ADMIN";

        if(!isAdmin){
            adminTab.style.display = "none";
        }
        //END OF ADMIN USERS

    document.getElementById("link-btn").addEventListener("click", getGoogleAuthUrl);
    //TESTING DASH LINK
    const dashboardType = localStorage.getItem("dashboardType");
    const dashboardLink = document.querySelector('.tab-list a[href*="defaultDashboard.html"]');

    if(dashboardLink){
        dashboardLink.setAttribute("href",
            dashboardType === "customizable"
            ? "customizableDashboard.html"
            : "defaultDashboard.html");
    }

    const links = document.querySelectorAll(".tab-list a");
    const currentURL = window.location.href;
    links.forEach(link => {
        if(currentURL.includes(link.href)){
            link.classList.add("active");
        }
    });
    //END OF DASH SET UP
    const urlParams = new URLSearchParams(window.location.search);
    const isLinked = urlParams.get("linked") === "true";
    //ADDED THIS FOR TESTING SESSION STORAGE
    const restoredToken = urlParams.get("token");

    if(restoredToken){
        localStorage.setItem("jwt", restoredToken);

        window.history.replaceState({}, document.title, window.location.pathname + '?linked=true');
    }
    //END OF STORAGE JWT

    if(isLinked && localStorage.getItem("jwt")){
        setTimeout(fetchCalendarEvents, 300);
        //fetchCalendarEvents();
    }else if(isLinked){
        alert("Session expired. PLease log in again")
        //fetchCalendarEvents();
    }
    });

    //helper for logout function
  function parseJwt(token){
    try{
        const base64Url = token.split('.')[1]; //gets payload of jwt
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e){
        console.error("Ivalid JWT", e);
        return null;
    }
  }