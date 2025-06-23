//code for decoding jwt and getting user signed in
function getUserIdFromToken(){
    const token = localStorage.getItem("jwt");
    if(!token) return null;

    try{
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || payload.sub || null;
    }catch(error){
        console.error("Error decoding token:", error);
        return null;
    }
}
//end of code for user
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

function openPopup(){

    const token = localStorage.getItem("jwt");
    const payload = token ? parseJwt(token) : null;

    if(payload){
        document.getElementById("popupUsername").textContent = payload.sub || "Unknown";
        document.getElementById("popupRoles").textContent = payload.roles || "Not provided";
    }else{
        document.getElementById("popupUsername").textContent = "Unknown";
        document.getElementById("popupRoles").textContent = "Not provided";
   
    }

        document.getElementById("userPopup").style.display = "block";
}

function closePopup(){
    document.getElementById("userPopup").style.display = "none";
}

function signOut(){
    //clear user data from local storage
     localStorage.removeItem("jwt");
    // localStorage.removeItem("username");
    
    alert("You have been signed out.");
    window.location.href = "login.html";
}

window.onclick = function(event){
    const popup = document.getElementById("userPopup");
    if(event.target === popup){
        closePopup();
    }
}

window.addEventListener('load', startTour);
// code for tour
//const tourSteps = [
//code using into.Js

function startTour() {
    //check browser local storage if tour has been shown and saved already
    if(localStorage.getItem('dashboardTourShown')){
        //so if ^^ does exist in local storage then function stops immediatly using return
        return;
    }

    //mark tour as shown
    localStorage.setItem("dashboardTourShown", "true");

introJs().setOptions({
    steps: [
    {
        intro: "Welcome to your dashboard!! Let's take a quick tour."
    },
    {
        //query selector used - DOM method selects HTML element based on CSS selector
        element: document.querySelector("#s-curve-tile"),
        intro: "This is where your project's progress curve will show. Start a project to see this in action."
    },
    {
        element: document.querySelector("#deadlines-tile"),
        intro: "All your upcoming deadlines will appear here."
    },
    {
        element: document.querySelector("#teams-tile"),
        intro: "See all team members from this section once a team has been created."
    },
    {
        element: document.querySelector("#progress-tile"),
        intro: "Create a project to view its progress here."
    },
     {
        element: document.querySelector(".newProj-btn"),
        intro: "Create your first project! Tip: Create clients first.",
        position: 'top'
    },
    {
        element: document.querySelector(".newClient-btn"),
        intro: "Let's create your first client to get started!",
        position: 'top'
    }

    ]
}).start();
}

//end of tour code

//code for displaying deadlines on dashboard for all projects
async function loadDeadlines() {
    const container = document.getElementById("date-widget");
    const emptyState = document.querySelector(".empty-state");
    //COMMENTED OUT BOTTOM LINE FOR EMPTY MSG
    container.innerHTML = "";
    emptyState.style.display = "none";

    try{
        const res = await fetch("http://localhost:8081/api/projects/deadlines");
        if(!res.ok) throw new Error("Failed to fetch deadlines");

        const projects = await res.json();

        if(!projects || projects.length === 0){
            emptyState.style.display = "block";
            return;
        }
        // if(projects.length === 0){
        //     container.innerHTML = `<p class="empty-state">No upcoming deadlines.</p>`;
        //     return;
        // }

        projects.forEach(project => {
            const deadlineDate = new Date(project.deadline);
            const today = new Date();
            const diffTime = deadlineDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            const item = document.createElement("div");
            item.className = "deadline-item";
            item.innerHTML =   `
                <strong>${project.name}</strong><br>
                Deadline: ${deadlineDate.toDateString()}<br>
                ${diffDays >= 0 ? `${diffDays} days left` : `Deadline passed`}
            `;
            container.appendChild(item);
        });
    
    } catch(err){
        console.error("Error loading deadlines: ", err);
        container.innerHTML = `<p class="error">Could not load deadlines.</p>`;
    }
}
//window.addEventListener("DOMContentLoaded", loadDeadlines);

//code for the graph on the dashboard
let sCurveChart = null;
 async function loadProjectOptions(){
    
    //ADDED 
    // const token = localStorage.getItem("jwt");

    //     if(!token){
    //         console.error("No token found. User not authenticated.");
    //         return [];
    //     }

    //     const response = await fetch("http://localhost:8081/api/projects/user", {
    //         headers: {
    //             "Authorization": "Bearer " + token
    //         }
    //     });

    //     if(!response.ok){
    //         console.error("Failed to load user projects.");
    //         return [];
    //     }
    //     const projects = await response.json();
        //const data = await response.json();
        //return data;
    //END OF ADDED
    
    const res = await fetch("http://localhost:8081/api/projects");
    const projects = await res.json();
    const selector = document.getElementById("projectSelector");

    projects.forEach((p, index) => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = p.projectName;
        selector.appendChild(option);
    });

    //load first project by default to display
    if(projects.length > 0){
        loadSCurveData(projects[0].id);
    }

    selector.addEventListener("change", () => {
        const selectedId = selector.value;
        loadSCurveData(selectedId);
    });
 }

 async function loadSCurveData(projectId){
    const res = await fetch(`http://localhost:8081/api/projects/${projectId}/s-curve`);
    const data = await res.json();

    const emptyState = document.querySelector(".empty-state");

    if(data && data.length == 0){
        emptyState.style.display = "block";
    } else{
        emptyState.style.display = "none";

        const labels = data.map(p => p.date);
    const values = data.map(p => p.progressPercentage);

    if(sCurveChart){
        sCurveChart.destroy();
    }

    const ctx = document.getElementById("sCurveChart").getContext("2d");
    sCurveChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Project Progress Over Time',
                data: values,
                fill: false,
                borderColor: 'blue',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: " Progress (%) " }, min: 0, max: 100 }
            }
        }
    });

    }
 }

 //window.addEventListener("DOMContentLoaded", loadProjectOptions);

 async function loadTeams(){
    console.log("Calling loadTeams()...");
    const container = document.getElementById("teams-tile");
    //container.innerHTML = "";

    try{
        const response = await fetch("http://localhost:8081/api/teams/users");
        
        if(!response.ok) throw new Error("Failed to fetch teams");
        const teams = await response.json();

        const emptyState = document.querySelector(".empty-state-teams");
        if(teams && teams.length == 0){
            emptyState.style.display = "block";
        } else{
            emptyState.style.display = "none";
        

        // if(teams.length === 0){
        //     container.innerHTML = `<p class="empty-state">No teams created yet.</p>`;
        //     return;
        // }

        // const heading = document.createElement("h3");
        // heading.className = "teams-heading";
        // heading.innerHTML = "Teams:";
        // container.appendChild(heading);

        teams.forEach(team => {
            const userHtml = team.users && team.users.length > 0
            ? team.users.map(u => `<li>${u.username} (${u.email})</li>`).join("")
            : `<li>No members</li>`;

            const item = document.createElement("div");
            item.className = "team-item";
            item.innerHTML =   `
                <strong>${team.name}</strong><br>
                <ul>${userHtml}</ul>
            `;
            container.appendChild(item);
        });
        }
    } catch(err){
        console.error("Error loading teams: ", err);
        container.innerHTML = `<p class="error">Could not load teams.</p>`;
    }
 }

//  //load project data for that user
//  async function getProjectData(){
    
//         const token = localStorage.getItem("jwt");

//         if(!token){
//             console.error("No token found. User not authenticated.");
//             return [];
//         }

//         const response = await fetch("http://localhost:8081/api/projects/user", {
//             headers: {
//                 "Authorization": "Bearer " + token
//             }
//         });

//         if(!response.ok){
//             console.error("Failed to load user projects.");
//             return [];
//         }

//         const data = await response.json();
//         return data;
    
// }
// //end of project loading for user

 //code for task loading
async function getTasks(){
    const token = localStorage.getItem("jwt");
    if(!token){
        alert("No token found. Please log in again");
        return [];
    }

    try{
        //TESTING BELOW LINE -COMMMENTED OUT ONE IS WORKING
        //const response = await fetch("http://localhost:8081/api/tasks/user", {
         const response = await fetch("http://localhost:8081/api/tasks", {
            method: "GET",
             headers: {
                    "Authorization": "Bearer " + token
                }
        });

        if(!response.ok){
        if(response.status === 401){
            alert("Session expired. Please log in again.");
            localStorage.removeItem("jwt");
            window.location.href = "/login.html";
            return [];
        }else{
            throw new Error("Unauthorized.");
        }
    }

    const data = await response.json();
    return data;

    }catch(error) {
        console.log("Error fetching from backend: " + error);
        return [];
    }

    
}
//end of tasks code

//code for displaying completed tasks in that container
//const progTile = document.getElementById("progress-tile");

async function loadTasksComplete(){
    console.log("Loading completed tasks...");
    const progTile = document.getElementById("progress-tile");

    // progTile.innerHTML ='';
    //const projects = await getProjectData();
    const allTasks = await getTasks();
    console.log("Tasks loaded:", allTasks);
    const res = await fetch("http://localhost:8081/api/projects");
    const projects = await res.json();
   // const projects = await getProjectData(); //ADDED FOR TESTS

    let message = document.querySelector(".empty-state-tasks");
    if(projects.length === 0)
    {
        message.style.display = "block";
        return;
    } else{
        message.style.display = "none";
    }
    // const emptyMsg = progTile.querySelector(".empty-state");
    // if(emptyMsg) emptyMsg.remove();

    //extract unique projects from tasks
    //const projectsMap = new Map();
    // allTasks.forEach(task => {
    //     const project = task.project;
    //     if(project && !projectsMap.has(project.id)){
    //         projectsMap.set(project.id, project);
    //     }
    // });

    //const projects = Array.from(projectsMap.values());
    let totalCompletedTasks = 0;
    projects.forEach(project => {
        // const completeTasks = allTasks.filter(
        //     t => t.project?.id === project.id && t.taskStatus === "COMPLETE"
        // );
        const completeTasks = allTasks.filter(
        //t => t.project?.id === project.id && t.taskStatus === "COMPLETE"
        t => t.projectId === project.id && t.taskStatus === "COMPLETE"
            //task => Number(task.projectId) === Number(project.id) && task.taskStatus === "COMPLETE"
    );

        totalCompletedTasks += completeTasks.length;

        const projectBox = document.createElement("div");
        projectBox.className = "indiv-project-task";

        projectBox.innerHTML = `
            <h3 id="project-name">${project.projectName}</h3>
            <ul class="task-list">
                ${
                    completeTasks.length > 0
                    ? completeTasks.map(t => `<li>${t.taskName}</li>`).join("")
                    : "<li class='no-tasks'>No completed tasks yet.</li>"
                }
            </ul>
        `;

        progTile.appendChild(projectBox);
    });

}



//end of code for completed tasks

 //code for notification loading
 async function loadNotifications(){
    const notificationList = document.getElementById("notification-list");
    notificationList.innerHTML = "";

    const token = localStorage.getItem("jwt");

    if(!token){
        notificationList.innerHTML = `<li>User not authenticated</li>`;
        return;
    }

    try{
        const res = await fetch("http://localhost:8081/api/notifications/user", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        if(!res.ok) throw new Error("Failed to fetch notifications");
        const notifications = await res.json();

        if(notifications.length === 0){
            notificationList.innerHTML = `<li>No upcoming deadlines</li>`;
            return;
        }

        notifications.forEach(note => {
            const li = document.createElement("li");
            li.textContent = note;
            notificationList.appendChild(li);
        });
    }catch(err){
        console.error("Error loading notifications: ", err);
        notificationList.innerHTML = `<li>Error loading notifications.</li>`;
    }
 }

 document.addEventListener("DOMContentLoaded", function () {

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
    //code for searhc functionality

    const searchInput = document.getElementById("dashboard-search");

    searchInput.addEventListener("input", async function () {

        const query = this.value.trim();

        const resultBox = document.getElementById("search-results");
        if(query.length < 2){
            if(resultBox) resultBox.remove();
            return;
        }
        //if(query.length < 2)return;

        const token = localStorage.getItem("jwt");

        try{
            const res = await fetch(`http://localhost:8081/api/search?q=${encodeURIComponent(query)}`, {
                headers: {
                    "Authorization" : "Bearer " + token
                }
            });

            if(!res.ok) throw new Error("Failed to fetch search results");

            const data = await res.json();
            renderSearchResults(data);
        }catch(err){
            console.error("Search error:", err);
        }

    });

    document.addEventListener("click", function (e) {
        const resultBox = document.getElementById("search-results");
        if(resultBox && !resultBox.contains(e.target) && e.target !== searchInput){
            resultBox.remove();
        }
    });
    //end of search
    const bell = document.getElementById("notification-bell");
    const dropdown = document.getElementById("notifications-container");

    bell.addEventListener("click", (event) => {
        event.stopPropagation();
        dropdown.classList.toggle("show");
        loadNotifications();
    });
    
    document.addEventListener("click", function(event){
        if(!document.getElementById("notification-wrapper").contains(event.target)){
        dropdown.classList.remove("show");
    }
    });
    
 });
  //window.addEventListener("DOMContentLoaded", loadTeams);
  window.addEventListener("DOMContentLoaded", () => {
        loadDeadlines();
        loadProjectOptions();
        loadTeams();
        loadTasksComplete();
  });

  function renderSearchResults(results){

        let container = document.getElementById("search-results");

        if(!container){
        container = document.createElement("div");
        container.id = "search-results";
        container.classList.add("search-results");
        document.querySelector(".main-content").appendChild(container);
        }

        //container.innerHTML = "";

        const section = (title, items, isProject = false) => {
            if(!items || items.length === 0) return "";

            // return `
            //     <div class="result-section">
            //     <h4>${title}</h4>
            //     <ul>${items.map(i => `<li>${i}</li>`).join("")}</ul>
            //     </div>
            // `;
            return `
                <div class="result-section">
                <h4>${title}</h4>
                <ul>
                ${items.map(i => `<li>
                    ${isProject
                        ? `<a href="oneProject.html?id=${i.id}">${i.name}</a>`
                        : i}
                    </li>`).join("")}
                    </ul>
                </div>
            `;
        };

        container.innerHTML = `
            ${section("Projects", results.projects, true)}
            ${section("Teams", results.teams)}
        `;

        if(!results.projects.length && !results.teams.length){
            container.innerHTML = "<p>No matching results found.</p>";
        }
  }

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