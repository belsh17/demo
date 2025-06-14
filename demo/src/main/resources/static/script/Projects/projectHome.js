document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:8081/api/projects")
    .then(res => res.json())
    .then(projects => {
        const container = document.querySelector(".project-tiles");
        const message = document.querySelector(".no-projects-msg");

        if(projects.length === 0){
            message.computedStyleMap.display = "block";
        } else{
            message.computedStyleMap.display = "none";

            projects.forEach(project => {
                const tile = document.createElement("div");
                tile.className = "project-tile";
                tile.innerHTML = `
                <h3>${project.projectName}</h3>
                <p>${project.projectDescription}</p>
                <p><strong>Client:</strong> ${project.clientName}</p>
                <p><strong>Deadline:</strong> ${project.projectDeadline}</p>
                <a href="indivProject.html?id=${project.id}">View</a>`;
                container.appendChild(tile);
            });
        }
    })
    .catch(err => console.error("Error fetching projects:", err));
});