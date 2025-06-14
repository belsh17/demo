document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("create-new-client");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const clientData = {
            clientName: document.getElementById("client-name").value,
            email: document.getElementById("client-email").value,
            accountNumber: document.getElementById("client-account").value,
            phoneNumber: document.getElementById("client-number").value
        };

        try{
            console.log(clientData);
            
            const response = await fetch("http://localhost:8081/api/clients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(clientData)
            });

            if(!response.ok){
                throw new Error("Failed to create client");
            }

            const result = await response.json();
            alert("Client created: " + result.clientName);
            form.reset();
        }catch(error){
            console.error(error);
            alert("Error creating client. Please try again.");
        }
    });
});