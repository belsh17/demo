//CODE FOR TOUR OR GUIDE ON EACH PAGE

function startTour() {

introJs().setOptions({
    steps: [
    {
        intro: "Welcome to your teams page!! Let's take a quick tour."
    },
    {
        element: document.getElementById("create-new-team"),
        intro: "This is where you create a new team."
    },
    {
        element: document.getElementById("team-name"),
        intro: "Enter your team name."
    },
    {
        element: document.getElementById("project-team"),
        intro: "Select the project the team is associated with."
    },
    {
        element: document.getElementById("member-btn"),
        intro: "Click here to add a user to the team!"
    },
     {
        element: document.getElementById("submit-btn"),
        intro: "Create your first team!",
        position: 'top'
    }

    ]
}).start();
}

//end of tour code
//END OF CODE FOR TOUR ON EACH PAGE
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
let users = [];
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
    //load projects to load into dropdown
    //using project controller for listing all projects
    fetch("http://localhost:8081/api/projects")
    // fetch("http://localhost:8081/api/projects/user/display", {
    //         headers: {
    //             "Authorization": "Bearer " + token
    //         });
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
    //const token = localStorage.getItem("jwt");
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

     //ADDED FOR TOUR
        const helpButton = document.getElementById("help-button");
        if(helpButton){
            helpButton.addEventListener("click", () => {
                startTour();
            });
        }
        //END OF ADDED FOR TOUR
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