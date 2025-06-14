//const { response } = require("express");


document.addEventListener("DOMContentLoaded", function() {
    const createAccButton = document.getElementById("createAcc");
    createAccButton.addEventListener("click", async (event) => {
        await navigate(event);
    });
})
    //code for radio button selection and navigate
async function navigate(event) {
    event.preventDefault();
//selected dashabord value
        const selectedOption = document.querySelector('input[name="dashboardSetup"]:checked')?.value;
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const termsBox = document.getElementById("termsBox").checked;
        const errorMsg = document.getElementById("error-message");
        const form = document.getElementById("signUpForm");


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

        //prepare request body
        const requestBody = {
            username: username,
            email: email,
            password: password,
            dashboardType: selectedOption
        };

        try{
            const response = await fetch("http://localhost:8081/api/users/signup", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(requestBody)
            });
            if(response.ok){
                // const data = await response.json();
                // const dashboardType = data.dashboardType;
                if(selectedOption === "default"){
                window.location.href = "/defaultDashboard.html";
            }else if(selectedOption === "custom"){
                window.location.href = "/customizableDashboard.html"
            } else{
                alert("Unknown dashboard type selected.");
            }
        } else{
            const errorData = await response.json();
            errorMsg.textContent = errorData.message || "Signup failed.";
        }
    }catch (error) {
            console.error("Signup error:" , error);
    }
   
}
