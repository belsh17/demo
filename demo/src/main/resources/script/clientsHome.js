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

//START OF TEXT CODE FOR USER CLIENT LINK

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

    console.log("Dashboard type:", dashboardType);
    if(!dashboardType){
        console.warn("dashboardType not set in local storage");
    }

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
    //const token = localStorage.getItem("jwt");

        if(!token){
            console.error("No token found. User not authenticated.");
            return [];
        }

        //fetch("http://localhost:8081/api/clients/user", {
        fetch("http://localhost:8081/api/clients", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        .then(res => {
            console.log("Response status:", res.status);
            if(!res.ok){
                throw new Error("Failed to fetch clients");
            }
            return res.json();
        })
        .then(data => {
    
        const container = document.querySelector(".clients-tiles");
        const message = document.querySelector(".no-clients-msg");

        if(!container || !message){
            console.error("Required elements missing in DOM");
            return;
        }

        //if client exists its more than 0
        if(data.length > 0){
            message.style.display = "none";

             data.forEach(client => {
                const tile = document.createElement("div");
                //creates class client tile
                tile.classList.add("client-tile");

                tile.innerHTML = `
                
                <p><strong>Client Name:</strong> ${client.clientName || "N/A"}</p>
                <p><strong>Email:</strong> ${client.email || "N/A"}</p>
                <p><strong>Account:</strong> ${client.accountNumber || "N/A"}</p>
                <p><strong>Number:</strong> ${client.phoneNumber || "N/A"}</p>
                `;
                container.appendChild(tile);
            });

        } else{
            //if no clients show the no clients block
            message.style.display = "block";

            }
    })

    .catch(err => {
        console.error("Error fetching clients:", err)
    });
});
//END OF TEST CODE FOR CLIENTS FOR LOGGED IN USER

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
