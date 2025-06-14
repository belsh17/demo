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