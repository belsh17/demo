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

const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("id");

async function getProjectDetails(){
    //fetch projects details
    //COMMMENTED OUT WORKS 
    // return fetch("http://localhost:8081/api/projects")
    // .then(res => res.json())
    // .catch(error => {
    //     console.log("Error fetching from backend: " + error);
    //     return [];
    // });
    //TESTING 
    const token = localStorage.getItem("jwt");

        if(!token){
            console.error("No token found. User not authenticated.");
            return [];
        }

        const response = await fetch("http://localhost:8081/api/projects/user", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if(!response.ok){
            console.error("Failed to load user projects.");
            return [];
        }

        const data = await response.json();
        return data;
    //END OF TESTING
}

//fetch for tasks once created and saved
// async function getTasks(){
//     //return fetch(`http://localhost:8081/api/projects/${projectId}/tasks`)
//      return fetch("http://localhost:8081/api/tasks")
//     .then(res => res.json())
//     .catch(error => {
//         console.log("Error fetching from backend: " + error);
//         return [];
//     });
// }

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

document.addEventListener("DOMContentLoaded", async () => {

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
    //const { projects, tasks } = await fetchData();
    const tasks = await getTasks();
    console.log("Fetched tasks:", tasks);
    const projects = await getProjectDetails();
    //select inner container for proj. dead. so must target dead.-con.
    const container = document.querySelector(".main-content > .deadlines-container");

    const message = document.querySelector(".no-projects-msg");

    if(!container){
        console.error("Deadlines container not found");
        return;
    }

    if(!projects || projects.length === 0){
        message.style.display = "block";
        //container.innerHTML = "<p>No project data available.</p>";
        //return;
    } else{
        message.style.display = "none";

    projects.forEach(project => {
            //const relatedTasks = tasks.filter(task => Number(task.project.id) === Number(project.id));
            //const relatedTasks = tasks.filter(task => task.project && Number(task.project.id) === Number(project.id));
            const relatedTasks = tasks.filter(task => Number(task.projectId) === Number(project.id));
          
            
            tasks.forEach(task => {
                console.log("Task project ID:", task.project?.id);
            });
            //const relatedTasks = tasks.filter(t => t.projectId === project.id);
            const projectBlock = document.createElement("div");
            projectBlock.className = "project-deadline-block";

            projectBlock.innerHTML = `
                <h2 class="dead-title">${project.projectName}</h2>
                <p class="dead-text"><strong>Deadline:</strong> ${project.deadlineDate}</p>
                <div class="task-list">
                    ${
                        relatedTasks.length > 0
                        ? relatedTasks.map(task => ` 
                            <div class="task-item">
                                <h4 class="dead-text1">${task.taskName}</h4>
                                <p class="dead-text1">${task.taskDescription}</p>
                                <p class="dead-text1"><strong>Due:</strong> ${task.dueDate}</p>
                                <p class="dead-text1"><strong>Status:</strong> ${task.taskStatus}</p>
                            </div>
                        `).join("")
                    : "<p>No tasks for this project.</p>"
                }
                </div>
                `;

                container.appendChild(projectBlock);
    });
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