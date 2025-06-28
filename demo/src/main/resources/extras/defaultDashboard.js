function openPopup(){
        document.getElementById("userPopup").style.display = "block";
}

function closePopup(){
    document.getElementById("userPopup").style.display = "none";
}

function signOut(){
    //clear user data from local storage
    // localStorage.removeItem("authToken");
    // localStorage.removeItem("username");
    
    alert("You have been signed out.");
    window.location.href = "login.html";
}

window.onclick = function(event){
    const popup = document.getElementById("userPopup");
    if(event.target === popup){
        closePopup();
    }
}

window.addEventListener('load', startTour);
// code for tour
//const tourSteps = [
//code using into.Js

function startTour() {
    //check browser local storage if tour has been shown and saved already
    if(localStorage.getItem('dashboardTourShown')){
        //so if ^^ does exist in local storage then function stops immediatly using return
        return;
    }

    //mark tour as shown
    localStorage.setItem("dashboardTourShown", "true");

introJs().setOptions({
    steps: [
    {
        intro: "Welcome to your dashboard!! Let's take a quick tour."
    },
    {
        //query selector used - DOM method selects HTML element based on CSS selector
        element: document.querySelector("#s-curve-tile"),
        intro: "This is where your project's progress curve will show. Start a project to see this in action."
    },
    {
        element: document.querySelector("#deadlines-tile"),
        intro: "All your upcoming deadlines will appear here."
    },
    {
        element: document.querySelector("#teams-tile"),
        intro: "See all team members from this section once a team has been created."
    },
    {
        element: document.querySelector("#progress-tile"),
        intro: "Create a project to view its progress here."
    },
     {
        element: document.querySelector(".newProj-btn"),
        intro: "Let's create your first project!",
        position: 'top'
    }

    ]
}).start();
}

//end of tour code

