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

// use mock data if set to true else get from backend
// did this because couldnt store data to backend
const userMockData = false;

async function getProjectData(){
    if(userMockData){
        return fetch("/demo/src/main/resources/static/data/mockProjects.json")
        .then(response => response.json())
        .catch(error => {
            console.log("Error loading mock data:", error);
            return[];
        });
    }else{
        return fetch("http://localhost:8081/api/projects")
        .then(response => response.json())
        .catch(error => {
            console.error("Error fetching from backend:" + error);
            return [];
        });
    }
}

    document.addEventListener("DOMContentLoaded", async () => {
    const projects = await getProjectData();
    const container = document.querySelector(".project-tiles");
    const message = document.querySelector(".no-projects-msg");

    container.innerHTML = "";

    if(projects.length === 0){
            message.style.display = "block";
        } else{
            message.style.display = "none";

            projects.forEach(project => {
                const tile = document.createElement("div");
                tile.className = "project-tile";
                tile.innerHTML = `
                <h3 class="project-title">${project.projectName}</h3>
                <p class="project-description">${project.projDescription}</p>
                <p class="project-details"><strong>Client:</strong> ${project.client.name}</p>
                <p class="project-details"><strong>Project Manager:</strong> ${project.projectManager.name}</p>
                <p class="project-details"><strong>Start Date:</strong> ${project.startDate}</p>
                <p class="project-details"><strong>Deadline:</strong> ${project.deadlineDate}</p>
                <a href="oneProject.html?id=${project.id}">View</a>`;
                container.appendChild(tile);
            });
        }
    });
    
   
        

        
