//load existing tasks from local storage on page load
// window.onload = function(){
//     loadTasks();
// };
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

//start tour code

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

    // //mark tour as shown
     localStorage.setItem("dashboardTourShown", "true");

introJs().setOptions({
    steps: [
    {
        intro: "Welcome to your dashboard!! Let's take a quick tour."
    },
    {
        //query selector used - DOM method selects HTML element based on CSS selector
        element: document.querySelector(".graph-widget"),
        intro: "This is where your project's progress curve will show. Start a project to see this in action."
    },
    {
        element: document.querySelector(".dead-widget"),
        intro: "All your upcoming deadlines will appear here."
    },
    {
        element: document.querySelector(".meeting-widget"),
        intro: "All complete project tasks will appear here."
    },
    {
        element: document.querySelector(".task-widget"),
        intro: "Create a to do list here."
    },
    {
        element: document.querySelector(".team-widget"),
        intro: "See all team members from this section once a team has been created."
    },
    {
        element: document.querySelector(".progress-widget"),
        intro: "Create a task in your to do list to view its progress here."
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
        if(res.status === 401){
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
    const progTile = document.getElementById("meetings");
    //const projects = await getProjectData();
    const allTasks = await getTasks();
    console.log("Tasks loaded:", allTasks);
    const res = await fetch("http://localhost:8081/api/projects");
    const projects = await res.json();

    let message = document.querySelector(".empty-state-tasks");
    if(projects.length === 0)
    {
        message.style.display = "block";
        return;
    } else{
        message.style.display = "none";
    }

    // const emptyMsg = progTile.querySelector(".empty-state-tasks");
    // if(allTasks.length === 0) {
    //     emptyMsg.style.display = "block";
    // }
    //extract unique projects from tasks
    // const projectsMap = new Map();
    // allTasks.forEach(task => {
    //     const project = task.project;
    //     if(project && !projectsMap.has(project.id)){
    //         projectsMap.set(project.id, project);
    //     }
    // });

    //const projects = Array.from(projectsMap.values());

    projects.forEach(project => {
        const completeTasks = allTasks.filter(
            t => t.projectId == project.id && t.taskStatus === "COMPLETE"
        );

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

function updateProgress(){
    const tasks = document.querySelectorAll(".task");
    const completed = [...tasks].filter(task => task.checked).length;
    const total = tasks.length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    const circle = document.getElementById("circle");
    const label = document.getElementById("progress-label");

    circle.style.setProperty('--progress', percentage);
    // const circumference = 2 * Math.PI * 25;
    // const offset = circumference - (percentage / 100) * circumference;
    // circle.style.strokeDashoffset = offset;
    label.textContent = `${percentage}%`;
}

function addTask(){
    const input = document.getElementById("task-input");
    const taskText = input.value.trim();
    if(taskText === '') return;

    const taskList = document.getElementById("task-list");

    const li = document.createElement("li");
    li.innerHTML = `<label>
                        <input type = "checkbox" class="task"> 
                        <span>${taskText}</span>
                    </label>
                    <button class="delete-btn">X</button>
                `;
    li.querySelector(".task").addEventListener("change", () => {
        saveTasks();
        updateProgress();
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
        saveTasks();
        updateProgress();
    });

    taskList.appendChild(li);
    input.value = '';
    saveTasks();
    updateProgress();
}

function saveTasks(){
    const tasks = [];
    document.querySelectorAll("#task-list li").forEach(li => {
            const checkbox = li.querySelector(".task");
            const text = li.querySelector("span").textContent;
            tasks.push({ text, completed: checkbox.checked });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks(){
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `<label>
                        <input type = "checkbox" class="task" ${task.completed ? "checked" : ""}> 
                        <span>${task.text}</span>
                    </label>
                    <button class="delete-btn">X</button>
                `;

        li.querySelector(".task").addEventListener("change", () => {
            saveTasks();
            updateProgress();
        });

        li.querySelector(".delete-btn").addEventListener("click", () => {
            li.remove();
            saveTasks();
            updateProgress();
        });

        taskList.appendChild(li);
    });

    updateProgress();
}

function clearAllTasks(){
    if(confirm("Clear all tasks?")) {
        localStorage.removeItem("tasks");
        loadTasks();
    }
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
    const container = document.querySelector(".tiles-container");

    //loading saved widgetrs from local storage 
    const savedOrder = JSON.parse(localStorage.getItem("widgetOrder"));
    if(savedOrder){
        savedOrder.forEach(id => {
            const el = document.getElementById(id);
            if(el) container.appendChild(el);
        });
    }

    //make widgets draggable
    container.querySelectorAll(".tiles-container > div").forEach(widget => {
        widget.setAttribute("draggable", true); //enables dragging

        //when the user drags
        widget.addEventListener("dragstart", (e) => {
            widget.classList.add("dragging");
            widget.style.display = ""; //shows widget again
            saveWidgetOrder();

            widget.addEventListener("dragend", () => {
                widget.classList.remove("dragging");
                saveWidgetOrder();
            });
        });
    });

    container.addEventListener("dragover", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        //find correct position
        const afterElement = getDragAfterElement(container, e.clientY);
        if(afterElement == null){
            container.appendChild(dragging);
        } else{
            container.insertBefore(dragging, afterElement);
        }
    });

    //helper: find widget directly below the dragging cursor
    function getDragAfterElement(container, y){
        const draggableElements = [...container.querySelectorAll(".tiles-container > div:not(.dragging)")];

        return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect(); //get possition of ea. widget
                const offset = y - box.top - box.height / 2;

                if(offset < 0 && offset > closest.offset){
                    return { offset: offset, element: child };
                }else{
                    return closest;
                }

        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    //save currect widget order to local storage
    function saveWidgetOrder(){
        //collect ids in order
        const order = [...container.children].map(child => child.id);
        //save as JSON string
        localStorage.setItem("widgetOrder", JSON.stringify(order));
    }

    //close button to remove widgets
    document.querySelectorAll(".close-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const widget = btn.parentElement;
            //remove from dom
            widget.remove();
            saveWidgetOrder();
        });
    });
});

//code for displaying deadlines on dashboard for all projects
async function loadDeadlines() {
    const container = document.getElementById("deadlines");
    container.innerHTML = "";

    try{
        // const res = await fetch("http://localhost:8081/api/projects/deadlines");
        // if(!res.ok) throw new Error("Failed to fetch deadlines");

        const token = localStorage.getItem("jwt");

        if(!token){
            console.error("No token found. User not authenticated.");
            return [];
        }

        const response = await fetch("http://localhost:8081/api/projects/deadlines", {
        
        //const response = await fetch("http://localhost:8081/api/projects/deadlines/user", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if(!response.ok){
            console.error("Failed to load user projects.");
            return [];
        }

        const projects = await response.json();
        console.log("Raw project response:", projects);

        //const projects = await res.json();

        if(projects.length === 0){
            container.innerHTML = `
            <h3 class="widget-heading">Deadlines:</h3>
            <p class="empty-state">No upcoming deadlines.</p>
            `;
            return;
        }

        const heading = document.createElement("h3");
        heading.className = "deadlines-heading";
        heading.innerHTML = "Deadlines:";
        container.appendChild(heading);
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
            // container.appendChild(heading);
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
    const token = localStorage.getItem("jwt");

        if(!token){
            console.error("No token found. User not authenticated.");
            return [];
        }

    //const res = await fetch("http://localhost:8081/api/projects/user", {
        const res = await fetch("http://localhost:8081/api/projects/user/display", {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if(!res.ok){
            console.error("Failed to load user projects.");
            return [];
        }
    //END OF ADDED

    //const res = await fetch("http://localhost:8081/api/projects");
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

    const emptyState = document.querySelector(".empty-state-graph");

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
    const container = document.getElementById("teams");
    container.innerHTML = "";

    try{
        const response = await fetch("http://localhost:8081/api/teams/users");
        
        if(!response.ok) throw new Error("Failed to fetch teams");
        const teams = await response.json();

        if(teams.length === 0){
            container.innerHTML = `
            <h3 class="widget-heading">Teams:</h3>
            <p class="empty-state">No teams created yet.</p>`;
            return;
        }

        const heading = document.createElement("h3");
        heading.className = "teams-heading";
        heading.innerHTML = "Teams:";
        container.appendChild(heading);

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
    } catch(err){
        console.error("Error loading teams: ", err);
        container.innerHTML = `<p class="error">Could not load teams.</p>`;
    }
 }

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

  