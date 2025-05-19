document.addEventListener("DOMContentLoaded", function() {
    const createAccButton = document.getElementById("createAcc");
    createAccButton.addEventListener("click", navigate);
})
    //code for radio button selection and navigate
    function navigate() {
//selected dashabord value
        const selectedOption = document.querySelector('input[name="dashboardSetup"]:checked')?.value;
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const termsBox = document.getElementById("termsBox").checked;
        const errorMsg = document.getElementById("error-message");

        // characters username can contain
        const usernamePattern = /^[a-zA-Z0-9_]{8,20}$/;
        if(!usernamePattern.test(username)){
            errorMsg.textContent = "Username must be at least 8 characters and contain only letters, numbers or underscores"
            return;
        }
        //check selected option to redirect
        if (selectedOption == "default") {
            window.location.href = "defaultDashboard.html"; //redirects to default
        } else if (selectedOption == "customizable") {
            window.location.href = "customizableDashboard.html"; //redirects to custom dashboard
        }
    }
