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
        document.getElementById("userPopup").style.display = "block";
}

function closePopup(){
    document.getElementById("userPopup").style.display = "none";
}

function signOut(){
    //clear user data from local storage
    // localStorage.removeItem("authToken");
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
        intro: "Let's create your first project!",
        position: 'top'
    }

    ]
}).start();
}

//end of tour code

//code for displaying deadlines on dashboard for all projects
async function loadDeadlines() {
    const container = document.getElementById("date-widget");
    container.innerHTML = "";

    try{
        const res = await fetch("http://localhost:8081/api/projects/deadlines");
        if(!res.ok) throw new Error("Failed to fetch deadlines");
        const projects = await res.json();

        if(projects.length === 0){
            container.innerHTML = `<p class="empty-state">No upcoming deadlines.</p>`;
            return;
        }

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
    container.innerHTML = "";

    try{
        const response = await fetch("http://localhost:8081/api/teams/users");
        
        if(!response.ok) throw new Error("Failed to fetch teams");
        const teams = await response.json();

        if(teams.length === 0){
            container.innerHTML = `<p class="empty-state">No teams created yet.</p>`;
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
  //window.addEventListener("DOMContentLoaded", loadTeams);
  window.addEventListener("DOMContentLoaded", () => {
        loadDeadlines();
        loadProjectOptions();
        loadTeams();
  });