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
