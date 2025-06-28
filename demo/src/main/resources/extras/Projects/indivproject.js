
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("create-project-form");
     if(form){
        form.addEventListener("submit", function(e){
            e.preventDefault();

            const project = {
            projectName: document.getElementById("project-name").value,
            projDescription: document.getElementById("project-description").value,
            deadlineDate: document.getElementById("project-deadline").value,
            startDate: document.getElementById("startDate").value,
            creationDate: new Date().toISOString().split("T")[0],
            clientId: 1, //for now, should test with existing client
            projectManagerId: 2,
            createdBy: 3, //also use existing i.e. logged on user
            // clientName: document.getElementById("client-name").value,
            // clientAccount: document.getElementById("client-account").value,
            //projManager: document.getElementById("proj-manager-name").value
            
        };

        fetch("http://localhost:8081/api/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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
