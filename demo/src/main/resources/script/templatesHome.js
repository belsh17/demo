
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
// code for clicking generic tile to redirect to generic templates
document.addEventListener("DOMContentLoaded", function(){
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
    const genericTile = document.getElementById("generic");
    genericTile.addEventListener("click", function(){
        window.location.href = "generic.html";
    });
});

// code for clicking fincance tile to redirect to fincance templates
document.addEventListener("DOMContentLoaded", function(){
    const fincanceTile = document.getElementById("finance");
    fincanceTile.addEventListener("click", function(){
        window.location.href = "finance.html";
    });
});

// code for clicking education tile to redirect to education templates
document.addEventListener("DOMContentLoaded", function() {
    const educationTile = document.getElementById("education");
    educationTile.addEventListener("click", function(){
        window.location.href = "education.html";
    });
});

// code for clicking construction tile to redirect to construction templates
document.addEventListener("DOMContentLoaded", function(){
    const constructionTile = document.getElementById("construction");
    constructionTile.addEventListener("click", function(){
        window.location.href = "construction.html";
    });
});

// code for clicking software dev. tile to redirect to software dev. templates
document.addEventListener("DOMContentLoaded", function(){
    const softDevTile = document.getElementById("software-dev");
    softDevTile.addEventListener("click", function(){
        window.location.href = "softDev.html";
    });
});

// code for clicking marketing tile to redirect to marketing templates
document.addEventListener("DOMContentLoaded", function(){
    const marketingTile = document.getElementById("marketing");
    marketingTile.addEventListener("click", function(){
        window.location.href = "marketing.html";
    });
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
