//CODE FOR TOUR OR GUIDE ON EACH PAGE

function startTour() {

introJs().setOptions({
    steps: [
    {
        intro: "Welcome to your rewards page!! Let's take a quick tour."
    },
    {
        element: document.querySelector(".project-rewards-section"),
        intro: "This is where your rewards are displayed"
    },
    {
        element: document.querySelector(".gift-bow"),
        intro: "A gift box will be developed once you have completed 5 tasks."
    },


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

async function getProjectData(){
    
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


async function getTasks(){
    const token = localStorage.getItem("jwt");
    if(!token){
        alert("No token found. Please log in again");
        return [];
    }

    try{
        //TESTING BELOW LINE -COMMMENTED OUT ONE IS WORKING
        //const response = await fetch("http://localhost:8081/api/tasks/user", {
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

//ADDED FOR CLAIMING REWARDS OR KEEPING BOX OPEN
function getClaimedRewards(){
    const stored = localStorage.getItem("claimedRewards");
    return stored ? JSON.parse(stored) : {};
}

function saveClaimedRewards(claimed){
    localStorage.setItem("claimedRewards", JSON.stringify(claimed));
}
//END OF ADDED


const rewardsContainer = document.getElementById("rewardsContainer");
async function loadProjectRewards(){

    const projects = await getProjectData();
    const allTasks = await getTasks();

    console.log("All tasks received from backend", allTasks);
    
    const message = document.querySelector(".no-rewards-msg");
    if(projects.length === 0)
    {
        message.style.display = "block";
    } else{

    message.style.display = "none";

    //ADDED FOR CLAIMING REWARD
    const claimedRewards = getClaimedRewards();
    //END OF ADDED MORE BELOW

    projects.forEach(project => {
       // const completedTasks = (project.tasks || []).filter( t => t.status === "COMPLETED");
        //FILTERS ALL TASKS FOR THAT USER TO ONLY GET COMPLETE ONES
       //const completedTasks = allTasks.filter(t => t.projectId === project.id && t.status === "COMPLETED");
    const completedTasks = allTasks.filter(t => t.projectId === project.id && t.taskStatus === "COMPLETE");

    console.log(`Project ${project.projectName} (${project.id}) completed tasks: `, completedTasks);
      
       //const progress = Math.min(completedTasks.length, 5);
       //COMMENTED OUT TOP CODE TO TEST BTM CODE FOR MULTIPLE GIFT BOXES
        const total = completedTasks.length;
       const boxesToRender = Math.floor(completedTasks.length / 5);
       const remainder = total % 5;
       //END OF TEST FOR TOP

        const projectBox = document.createElement("div");
        projectBox.className = "project-reward";

        let giftBoxesHTML = "";

        for(let i = 0; i < boxesToRender; i++){
            const taskGroup = completedTasks.slice(i * 5, i * 5 + 5);

            giftBoxesHTML += `
                <ul class="task-list">
                ${
                    taskGroup.map(t => `<li>${t.taskName}</li>`).join("")
                }
                </ul>
                <div class="gift-box stage-5" id="gift-${project.id}-${i}">
                    <div class="claimed-badge" style="display:none;">
                        Claimed
                    </div>
                    <div class="gift-avatar" id="avatar-${project.id}-${i}" style="display:none; width:100px; height:100px; position:absolute; bottom:160px; left:50%; transform:translateX(-50%; z-index:10;"></div>
               
                    <div class="box-base"></div>
                    <div class="box-wrap"></div>
                    <div class="lid"></div>
                    <div class="box-bow"></div>
                    <div class="box-decoration"></div>
                </div>
                <div class="surprise" id="surprise-${project.id}-${i}">
                    You earned reward #${i + 1} for <strong>${project.projectName}</strong>!
                </div>
            `;
        }

        if(remainder > 0){
            const remainingTasks = completedTasks.slice(boxesToRender * 5);

            giftBoxesHTML += `
                <ul class="task-list">
                ${
                    remainingTasks.map(t => `<li>${t.taskName}</li>`).join("")
                }
                </ul>
                <div class="gift-box stage-${remainder}" id="incomplete-gift-${project.id}">
                    <div class="box-base"></div>
                    <div class="box-wrap"></div>
                    <div class="lid"></div>
                    <div class="box-bow"></div>
                    <div class="box-decoration"></div>
                </div>
                <div class="surprise" style="opacity: 0;">
                    ${5 - remainder} more tasks{5 - remainder > 1 ? "s" : ""} to unlock your next reward.
                </div>
            `;
        }

        projectBox.innerHTML = `
            <h3>${project.projectName}</h3>
            <div class="gift-boxes" style="display: flex; flex-direction: column; gap: 15px;">
                ${giftBoxesHTML}
            </div>
            `;
            rewardsContainer.appendChild(projectBox);

            for(let i = 0; i < boxesToRender; i++){
                const giftBox = projectBox.querySelector(`#gift-${project.id}-${i}`);
                const surprise = projectBox.querySelector(`#surprise-${project.id}-${i}`);

                //more added for claiming and in innner html above
                const claimedBadge  = giftBox.querySelector(".claimed-badge");
                const giftId = `gift-${project.id}-${i}`;

                if(claimedRewards[giftId]){
                    giftBox.classList.add("open");
                    surprise.style.opacity = 1;
                    giftBox.style.cursor = "default";
                    claimedBadge.style.display = "block";
                }
                //END OF ADDED
                giftBox.style.cursor = "pointer";
                claimedBadge.style.display = "none";
                giftBox.addEventListener("click", () => {

                    //ADDED FOR CLAIMED
                    claimedRewards[giftId] = true;
                    saveClaimedRewards(claimedRewards);
                    //END OF ADDED
                    giftBox.classList.add("open");
                    surprise.style.opacity = 1;
                    //ADDED FOR CLAIMED
                    giftBox.style.cursor = "default";
                    claimedBadge.style.display = "block";
                    //END OF ADDED

                   setTimeout(() => {
                     //trigger confetti
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: {
                            x: giftBox.getBoundingClientRect().left / window.innerWidth,
                            y: giftBox.getBoundingClientRect().top / window.innerHeight
                        }
                    });

                    const avatarContainer = document.getElementById(`avatar-${project.id}-${i}`);

                    //so animation doesnt duiplicate
                    if(avatarContainer.lottieAnimation){
                        avatarContainer.lottieAnimation.destroy();
                        avatarContainer.innerHTML = "";
                    }

                    avatarContainer.style.display = "block";

                    avatarContainer.lottieAnimation = lottie.loadAnimation({
                        container: avatarContainer,
                        renderer: "svg",
                        loop: false,
                        autoplay: true,
                        //path: "https://assets4.lottiefiles.com/packages/lf20_1eznrzqb.json"
                    path: "../static/data/animation-popup.json"
                    });

                   }, 500);
                });
            }
        
        });
    }
}

// window.addEventListener("DOMContentLoaded", loadProjectRewards);
//COMMMNETD OUT TOP LINE FOR CLAIMECD REWARDS
window.addEventListener("DOMContentLoaded", () => {
    //ADDED CODE FOR BACK BUTTON
        const backBtn = document.querySelector(".back-button");
        if(backBtn){
            backBtn.addEventListener("click", function(){
                window.history.back();
            });
        }
        //END OF ADDED
    loadProjectRewards();

    const resetBtn = document.getElementById("reset-claimed-btn");
    if(resetBtn){
        resetBtn.addEventListener("click", () => {
            if(confirm("Are you sure you want to reset all claimed rewards?")){
                localStorage.removeItem("claimedRewards");
                location.reload();
            }
        });
    }
}); 
//END OF ADDED

//ADDED FOR TOUR
document.addEventListener("DOMContentLoaded", () => {
     //ADDED FOR TOUR
        const helpButton = document.getElementById("help-button");
        if(helpButton){
            helpButton.addEventListener("click", () => {
                console.log("Help button clicked.");
                startTour();
            });
        }
        //END OF ADDED FOR 
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

        const isAdmin = roles.includes("ADMIN") || roles.includes("ROLE_ADMIN");

        //const isAdmin = roles === "ADMIN" || roles === "ROLE_ADMIN";

        if(!isAdmin){
            adminTab.style.display = "none";
        }
        //END OF ADMIN USERS
    
    //TESTING DASH LINK
    const dashboardType = localStorage.getItem("dashboardType");
    const dashboardLink = document.getElementById("dashboard-link");
    //const dashboardLink = document.querySelector('.tab-list a[href*="defaultDashboard.html"]');

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
});