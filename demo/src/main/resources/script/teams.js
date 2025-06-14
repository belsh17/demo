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
let users = [];
document.addEventListener("DOMContentLoaded", () => {
    //load projects to load into dropdown
    //using project controller for listing all projects
    fetch("http://localhost:8081/api/projects")
    .then(res => res.json())
    .then(projects => {
        const projectSelect = document.getElementById("project-team");
        projects.forEach(project => {
                const option = document.createElement("option");
                option.value = project.id;
                option.textContent = project.projectName;
                projectSelect.appendChild(option);
        });
    })
    .catch(err => 
        console.error("Error loading projects: " + err)
    );
    //end of project loading code

    //code for loading users
    const token = localStorage.getItem("jwt");
     if(!token){
                alert("No token found. Please log in again");
                return;
            }

    fetch("http://localhost:8081/api/users", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        .then(res => {
                //submitButton.disabled = false;
                if(!res.ok) throw new Error("Unauthorized.");
                return res.json();
            })
            .then(data => {
                //alert("Team created");
                users = data;
            })
            .catch(err => {
                console.error(err);
                alert("Failed to load users");
                //submitButton.disabled = false;
            });
    //end of users code

    //code for form
    const form = document.getElementById("create-new-team");
    if(form){
        form.addEventListener("submit", function(e){
            e.preventDefault();

            const token = localStorage.getItem("jwt");
            if(!token){
                alert("No token found. Please log in again");
                return;
            }

            //team object
            const team = {
                teamName: document.getElementById("team-name").value,
                projectId: document.getElementById("project-team").value,
                members: []
            };

            //include users and roles
            document.querySelectorAll("#membersContainer > div").forEach(div => {
                const userId = div.querySelector("select").value;
                const role = div.querySelector("input").value;

                if(userId && role){
                    team.members.push({
                        userId,
                        teamRole: role
                    });
                }
            });

            const submitButton = form.querySelector("button[type='submit']");
            submitButton.disabled = true;
            
            fetch("http://localhost:8081/api/teams/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(team)
            })
            .then(res => {
                submitButton.disabled = false;
                if(res.ok) return res.json();
                throw new Error(
                    "Team creation failed."
                );
            })
            .then(data => {
                alert("Team created");
                form.reset();
                document.getElementById("membersContainer").innerHTML = "";
            })
            .catch(err => {
                console.error(err);
                alert("Error creating team");
                submitButton.disabled = false;
            });
        });
    }
});

//function for adding memeber to form
function addMember(){
    const container = document.getElementById("membersContainer");
    const index = container.children.length;

    const memberDiv = document.createElement("div");

    //loading into user dropdown
    const userSelect = document.createElement("select");
    userSelect.name = `members[${index}].userId`;
    userSelect.required = true;

    userSelect.innerHTML = `<option value="">-- Select User --</option>`;
    users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.fullName || user.username;
        userSelect.appendChild(option);
    });

    //user gets assigned team role
    const roleInput = document.createElement("input");
    roleInput.type = "text";
    roleInput.name = `members[${index}].teamRole`;
    roleInput.placeholder = "Enter Role";
    roleInput.required = true;

    memberDiv.appendChild(userSelect);
    memberDiv.appendChild(roleInput);
    container.appendChild(memberDiv);
}