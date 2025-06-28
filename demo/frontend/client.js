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
    const form = document.getElementById("clientForm");
    const createClientBtn = document.getElementById("submit-btn");
    createClientBtn.addEventListener("click", async (event) => {
        await navigate(event);
    });
});

async function navigate(event) {
    event.preventDefault();

    const clientName = document.getElementById("client-name").value;
    const clientEmail = document.getElementById("client-email").value;
    const clientAccount = document.getElementById("client-account").value;
    const clientNumber = document.getElementById("client-number").value;

    //left same as field names in entities
    const requestBody = {
        clientName: clientName,
        email: clientEmail,
        accountNumber: clientAccount,
        phoneNumber: clientNumber
    };

    try{
        const response = await fetch("http://localhost:8081/api/clients", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if(response.ok){
                alert("Client saved successfully!!");
                window.location.href = 'client.html';
            }else{
                const error = await response.text();
                alert("Failed to save client:" + error);
            }
        } catch(error){
            alert("Error: " + error.message);
        }

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
//     if(!form) return;

//     form.addEventListener("submit", async (e) => {
//         e.preventDefault();

//         const formData = new FormData(form);
//         const clientData = Object.fromEntries(formData.entries());

//         try{
//             const response = await fetch("/api/clients", {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(clientData)
//             });

//             if(response.ok){
//                 alert("Client saved successfully!!");
//                 window.location.href = 'client.html';
//             }else{
//                 const error = await response.text();
//                 alert("Failed to save client:" + error);
//             }
//         } catch(error){
//             alert("Error: " + error.message);
//         }
//    });