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
    fetch("http://localhost:8081/api/clients")
    .then(res => res.json())
    .then(data => {
        const container = document.querySelector(".clients-tiles");
        const message = document.querySelector(".no-clients-msg");

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