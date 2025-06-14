async function loadLessonPlanTemps(){
    try{

        const response = await fetch("/demo/src/main/resources/static/data/education.json");
        const data = await response.json();
        const gallery = document.getElementById("template-gallery");

        data.templates
        .filter(template => template.name == "Lesson Plan")
        .forEach(template => {
            const tile = document.createElement("div");
            tile.className = "template-tile1";

            tile.onclick = () => renderLessonPlanForm(template);

            const title = document.createElement("h3");
            title.className = "tile-title";
            title.textContent = template.name;

            const img = document.createElement("img");
            img.src = template.image;
            img.alt = template.name;

            tile.appendChild(img);
            tile.appendChild(title);
            gallery.appendChild(tile);

        });

    }catch(error){
        console.error("Error loading templates:", error);
    }
}

function renderLessonPlanForm(template){
    const formContainer = document.getElementById("template-form");
    formContainer.innerHTML = `<h2>${template.name}</h2>`;
    formContainer.dataset.templateId = template.id;

    template.fields.forEach(field => {
        const fieldWrapper = document.createElement("div");
        fieldWrapper.className = "field-wrapper";

        const label = document.createElement("label");
        label.textContent = field.label;
        label.className = "field-label";

        let input;
        if(field.type == "text"){
            input = document.createElement("input");
            input.type = "text";
            input.className = "text-input";
        } else if(field.type == "textarea"){
            input = document.createElement("input");
            input.type = "textarea";
            input.className = "textarea-input";
        } else if(field.type == "date"){
            input = document.createElement("input");
            input.type = "date";
        }

        fieldWrapper.appendChild(label);
        fieldWrapper.appendChild(input);
        formContainer.appendChild(fieldWrapper);
    });
    
}
loadLessonPlanTemps();

