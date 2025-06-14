
// code for clicking generic tile to redirect to generic templates
document.addEventListener("DOMContentLoaded", function(){
    const genericTile = document.getElementById("generic");
    genericTile.addEventListener("click", function(){
        window.location.href = "generic.html";
    });
});

// code for clicking fincance tile to redirect to fincance templates
document.addEventListener("DOMContentLoaded", function(){
    const fincanceTile = document.getElementById("finance");
    fincanceTile.addEventListener("click", function(){
        window.location.href = "finance.html";
    });
});

// code for clicking education tile to redirect to education templates
document.addEventListener("DOMContentLoaded", function() {
    const educationTile = document.getElementById("education");
    educationTile.addEventListener("click", function(){
        window.location.href = "education.html";
    });
});

// code for clicking construction tile to redirect to construction templates
document.addEventListener("DOMContentLoaded", function(){
    const constructionTile = document.getElementById("construction");
    constructionTile.addEventListener("click", function(){
        window.location.href = "construction.html";
    });
});

// code for clicking software dev. tile to redirect to software dev. templates
document.addEventListener("DOMContentLoaded", function(){
    const softDevTile = document.getElementById("software-dev");
    softDevTile.addEventListener("click", function(){
        window.location.href = "softDev.html";
    });
});

// code for clicking marketing tile to redirect to marketing templates
document.addEventListener("DOMContentLoaded", function(){
    const marketingTile = document.getElementById("marketing");
    marketingTile.addEventListener("click", function(){
        window.location.href = "marketing.html";
    });
});
