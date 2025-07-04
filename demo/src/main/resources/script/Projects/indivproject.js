//CODE FOR TOKEN EXPIRY
function isJwtExpired(token){
    if(!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  const jwt = localStorage.getItem("jwt");
  if(isJwtExpired(jwt)){
    alert("Your session has expired. Please log in again.");
    localStorage.removeItem("jwt");
    window.location.href = "login.html";
  }
//END OF CODE FOR TOKEN EXPIRY
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
    
    //load clients into dropdown option in form
    fetch("http://localhost:8081/api/clients")
    .then(res => res.json())
    .then(clients => {
        const clientSelect = document.getElementById("client-id");
        clients.forEach(client => {
            const option = document.createElement("option");
            option.value = client.id;
            option.textContent = client.clientName; //name shown in dropdown
            clientSelect.appendChild(option);
        });
    })
    .catch(
        err => console.error("Error loading clients:" + err)
    );
    //end of clients loading

    //load project managers in drop down
    fetch("http://localhost:8081/api/users/project-managers")
    .then(res => res.json())
    .then(managers => {
        const managerSelect = document.getElementById("project-manager-id");
        //managerSelect.innerHTML = "";

        managers.forEach(manager => {
            const option = document.createElement("option");
            option.value = manager.id;
            option.textContent = manager.fullName;
            managerSelect.appendChild(option);
        });
    })
    .catch(err => 
        console.error("Error loading project managers:", err)
    );

    //end of project manager loading
    const form = document.getElementById("create-project-form");
     if(form){
        form.addEventListener("submit", function(e){
            e.preventDefault();

            const project = {
            projectName: document.getElementById("project-name").value,
            projectDescription: document.getElementById("project-description").value,
            projectDeadline: document.getElementById("project-deadline").value,
            startDate: document.getElementById("startDate").value,
            clientId: document.getElementById("client-id").value,
            projectManagerId: document.getElementById("project-manager-id").value

        };
        const token = localStorage.getItem("jwt");
        //const token = localStorage.getItem("token");

        fetch("http://localhost:8081/api/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": "Bearer " + token })
            },
            body: JSON.stringify(project)
        })
        .then(res => res.json())
        .then(data => {
            alert("Project created successfully!");
            window.location.href = "projectsHome.html"
        })
        .catch(err => console.error("Error:", err));
    });
    }else{
        console.error("Form element not found");
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
