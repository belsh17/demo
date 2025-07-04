console.log("login.js loaded");
// document.getElementById("login-form").addEventListener("submit", function(event){
//     event.preventDefault();
//     loginUser();
// });
document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.getElementById("login-btn");
    loginButton.addEventListener("click", async (event) => {
        event.preventDefault();
        await loginUser();
    });

    //support enter key login
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", function(event){
        event.preventDefault();
        loginUser();
    });
});

async function loginUser(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:8081/api/auth/login", {
        method:"POST",
        //credentials: "include", //enables cookie/session use
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    if(response.ok) {

        const data = await response.json();
        localStorage.setItem("jwt", data.token);
        //ADDED TESTING
        localStorage.setItem("dashboardType", data.dashboardType);

        //END OF TESTING

        // alert("Login successful!!" + data.message);
        alert("Login successful!!");

        if(data.dashboardType === "customizable"){
            window.location.href = "customizableDashboard.html";
        }else{
            window.location.href = "defaultDashboard.html";
        }

    }else{
        const error = await response.text();
        //alert("Login failed: " + error);
        if(response.status === 401){
            alert("Invalid input data");
        }
    }

}