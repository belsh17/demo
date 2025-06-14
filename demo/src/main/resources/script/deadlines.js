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

const useMockData = false;
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("id");
// async function fetchData(){
//     if(useMockData){
//         const projects = await fetch("/demo/src/main/resources/static/data/mockProjects.json")
//         .then(res => res.json());
//         const tasks = await fetch("/demo/src/main/resources/static/data/mockTasks.json")
//         .then(res => res.json());
//         return { projects, tasks };
//     } else{
//         const projects = await fetch("http://localhost:8081/api/projects")
//         .then(res => res.json());
//         const tasks = await fetch("http://localhost:8081/api/tasks")
//         .then(res => res.json());
//         return { projects, tasks };
//     }
// }

async function getProjectDetails(){
    //fetch projects details
    return fetch("http://localhost:8081/api/projects")
    .then(res => res.json())
    .catch(error => {
        console.log("Error fetching from backend: " + error);
        return [];
    });
}

async function getTasks(){
    const token = localStorage.getItem("jwt");
    if(!token){
        alert("No token found. Please log in again");
        return [];
    }

    try{
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

document.addEventListener("DOMContentLoaded", async () => {
    //const { projects, tasks } = await fetchData();
    const tasks = await getTasks();
    const projects = await getProjectDetails();
    //select inner container for proj. dead. so must target dead.-con.
    const container = document.querySelector(".main-content > .deadlines-container");

    if(!container){
        console.error("Deadlines container not found");
        return;
    }

    if(!projects || projects.length === 0){
        container.innerHTML = "<p>No project data available.</p>";
        return;
    }

    projects.forEach(project => {
            const relatedTasks = tasks.filter(task => Number(task.project.id) === Number(project.id));
            

            const projectBlock = document.createElement("div");
            projectBlock.className = "project-deadline-block";

            projectBlock.innerHTML = `
                <h2 class="dead-title">${project.projectName}</h2>
                <p class="dead-text"><string>Deadline:</strong> ${project.deadlineDate}</p>
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
});