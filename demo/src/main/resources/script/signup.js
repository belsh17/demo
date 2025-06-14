console.log("signup.js loaded")
document.addEventListener("DOMContentLoaded", function() {
    const createAccButton = document.getElementById("createAcc");
    createAccButton.addEventListener("click", async (event) => {
        await navigate(event);
    });
});
    //code for radio button selection and navigate
async function navigate(event) {
    event.preventDefault();
//selected dashabord value
        const selectedOption = document.querySelector('input[name="dashboardType"]:checked')?.value;
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const fullName = document.getElementById("fullName").value;
        const termsBox = document.getElementById("termsBox").checked;
        const errorMsg = document.getElementById("error-message");


        errorMsg.textContent = "";
        // characters username can contain
        const usernamePattern = /^[a-zA-Z0-9_]{8,20}$/;
        if(!usernamePattern.test(username)){
            errorMsg.textContent = "Username must be at least 8 characters and contain only letters, numbers or underscores"
            return;
        }

        //check if terms are accepted
        if(!termsBox){
            errorMsg.textContent = "Please accept the terms and conditions";
            return;
        }

        if(!selectedOption){
            errorMsg.textContent = "Please select a dashboard type."
            return;
        }

        //proceed afgter dash selected
        errorMsg.textContent = "";

        //prepare request body
        const requestBody = {
            username: username,
            email: email,
            password: password,
            fullName: fullName,
            dashboardType: selectedOption
        };

        console.log("Preparing to send signup request: ", requestBody);
        try{
            const response = await fetch("http://localhost:8081/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(requestBody)
            });
            console.log("Response status:", response.status);
            
            if(response.ok){
                // const data = await response.json();
                // const dashboardType = data.dashboardType;
                alert("Signup successful!");
                const liveServerPort = 5500;
                if(selectedOption === "default"){
                //window.location.href = "/defaultDashboard";
                //use this when its live server and use ^ when its 8081
                window.location.href = "defaultDashboard.html";
                //window.location.href = "http://localhost:5500/defaultDashboard.html";
                //window.location.href = `http://localhost:${liveServerPort}/defaultDashboard.html`;
            }else if(selectedOption === "customizable"){
                window.location.href = "customizableDashboard.html";
                //window.location.href = "/customizableDashboard"
                //window.location.href = "http://localhost:5500/customizableDashboard.html"
                //window.location.href = `http://localhost:${liveServerPort}/customizableDashboard.html`;
                } else{
                alert("Unknown dashboard type selected.");
            }
        } else{
            //let errorData = await response.json();
            
            let errorMessage = "Signup failed.";

            try{
                const contentType = response.headers.get("content-type");
                if(contentType && contentType.includes("application/json")){
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                }else{
                    const text = await response.text();
                    if(text) errorMessage = text;
                }
            }catch(err){
                console.error("Error parsing error response: ", err);
            }

            //addded for existing users
            if(response.status === 409){
                errorMessage = "User already exists. PLease try logging in or use a different email";
            }else if(response.status === 400){
                errorMessage = "Invalid input data. PLease che3ck your details.";
            }
            //end of existing users code
            errorMsg.textContent = errorMessage;
        }
    }catch (error) {
            console.error("Signup failed:" , error);
            errorMsg.textContent = "An unexpected error occured. Please try again";
    }
   
}
