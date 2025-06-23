

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
        const token = localStorage.getItem("jwt");

        if(!token){
            console.error("No token found. User not authenticated.");
            return [];
        }

        // const response = await fetch("http://localhost:8081/api/projects/user", {
        const response = await fetch("http://localhost:8081/api/projects/user/display", {
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
    const projects = await getProjectData();
    const container = document.querySelector(".project-tiles");
    const message = document.querySelector(".no-projects-msg");

    container.innerHTML = "";

    if(!projects || projects.length === 0){
            message.style.display = "block";
        } else{
            message.style.display = "none";

            projects.forEach(project => {
                const projectName = project?.projectName || "Unnamed Project";
                const projDescription = project?.projDescription || "Nodescription";
                const clientName = project?.clientName || "No client";
                const managerName = project?.managerName || "No manager";
                const startDate = project?.startDate || "N/A";
                const deadlineDate = project?.deadlineDate || "N/A";
                const projectId = project?.id || "#";

                const tile = document.createElement("div");
                tile.className = "project-tile";
                tile.innerHTML = `
                <h3 class="project-title">${projectName}</h3>
                <p class="project-description"><strong>Description:</strong>${projDescription}</p>
                <p class="project-details"><strong>Client:</strong> ${clientName}</p>
                <p class="project-details"><strong>Project Manager:</strong> ${managerName}</p>
                <p class="project-details"><strong>Start Date:</strong> ${startDate}</p>
                <p class="project-details"><strong>Deadline:</strong> ${deadlineDate}</p>
                <a href="oneProject.html?id=${projectId}">View</a>`;
                container.appendChild(tile);
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

        
