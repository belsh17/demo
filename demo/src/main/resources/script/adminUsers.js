//CODE FOR TOUR OR GUIDE ON EACH PAGE

function startTour() {

introJs().setOptions({
    steps: [
    {
        intro: "Welcome to your users page!! Let's take a quick tour."
    },
    {
        element: document.querySelector(".users-display"),
        intro: "All registered users will be displayed here."
    },
    {
        element: document.querySelector(".user-tile"),
        intro: "Feel free to edit roles on this page"
    }

    ]
}).start();
}

//end of tour code
//END OF CODE FOR TOUR ON EACH PAGE

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
document.addEventListener("DOMContentLoaded",  () => {

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
    const token = localStorage.getItem("jwt"); //stores token of user once logged in
    if(!token){
        console.error("JWT token not found. User may not be authenticated.");
        return;
    }

    const availableRoles = ["ADMIN","USER","PROJECT_MANAGER"];
    
    fetch("http://localhost:8081/api/admin/users", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => {
        if(!res.ok){
            throw new Error("Unauthorized or fetch error. Status: " + res.status);
        }
        return res.json();
    })
    .then(users => {
        //const users = await getUserList();
    const container = document.querySelector(".users-tiles");
    const message = document.querySelector(".no-users-msg");

    container.innerHTML = "";


    if(users.length === 0){
        message.style.display = "block";
    }else{
        message.style.display = "none";

        users.forEach(user => {
            const tile = document.createElement("div");
            tile.className = "user-tile";

            //create a role dropdown for admin to change
            const roleOptions = availableRoles.map(role => {
                const selected = role === user.role ? "selected" : "";
                return `<option value="${role}" ${selected}>${role}</option>`;
            }).join("");

            tile.innerHTML = `
                <h3 class="user-title">Details</h3>
                <p class="user-details"><strong>Username:</strong> ${user.username}</p>
                <p class="user-details"><strong>Email:</strong> ${user.email}</p>
                <label for="role-${user.id}" class="form-label">Change role</label>
                <select name="role" id="role-${user.id}">
                    ${roleOptions}
                </select>
                <button class="update-role-btn" data-user-id="${user.id}">Save Changes</button>
                <p class="role-update-msg" id="msg-${user.id}" style="color: green;"></p>
            `;
            container.appendChild(tile);
        });

        //attach event liosten for the save changes button
        document.querySelectorAll(".update-role-btn").forEach(button => {
            button.addEventListener("click", async (e) => {
                const userId = e.target.getAttribute("data-user-id");
                const selectedRole = document.getElementById(`role-${userId}`).value;

                const response = await fetch(`http://localhost:8081/api/admin/users/${userId}/role`,{

                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }, 
                    body: JSON.stringify({newRole: selectedRole})
                });

                const msg = document.getElementById(`msg-${userId}`);
                if(response.ok){
                    msg.style.color = "green";
                    msg.textContent = "Role updated successfully";
                    //msg.textContent ="";
                }else{
                    msg.style.color = "red";
                    msg.textContent = "Failed to update role";
                }

                
            });
        });
        }
    })
    .catch(err => {
        console.error("Error fetching users:", err)
    });

    //ADDED FOR TOUR
        const helpButton = document.getElementById("help-button");
        if(helpButton){
            helpButton.addEventListener("click", () => {
                startTour();
            });
        }
        //END OF ADDED FOR TOUR
    
});