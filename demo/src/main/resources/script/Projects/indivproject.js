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

        const token = localStorage.getItem("token");

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
