async function loadProjectPlanTemplates(){
    const response = await fetch("/demo/src/main/resources/static/data/generic.json");
    const data = await response.json();
    const gallery = document.getElementById("template-gallery");

    data.templates
    .filter(template => template.name == "Project Planner")
    .forEach(template => {

        const tile = document.createElement("div");
        tile.className = "template-tile3";

        tile.onclick = () => renderProjectPlanTempForm(template);
        console.log("Rendering template: ", template.name, "Type:", template.type);

        const img = document.createElement("img");
        img.src = template.image;
        img.alt = template.name;

        const title = document.createElement("h3");
        title.textContent = template.name;

        tile.appendChild(img);
        tile.appendChild(title);
        gallery.appendChild(tile);

    });

}

function renderProjectPlanTempForm(template){
    const formContainer = document.getElementById("template-form");
    formContainer.innerHTML = `<h2>${template.name}</h2>`;
    formContainer.dataset.templateId = template.id;

    template.fields.forEach(field => {
        const fieldWrapper = document.createElement("div");
        fieldWrapper.className ="field-wrapper";
        const label = document.createElement("label");
        label.textContent = field.label;
         label.className = "field-label";

        let input;
        if(field.type == "text"){
            input = document.createElement("input");
            input.type = "text";
            input.className = "text-input"
            input.placeholder = field.placeholder || "";
        }else if(field.type == "textarea"){
            input = document.createElement("input");
            input.type = "textarea";
            input.className = "textarea-input";
            input.placeholder = field.placeholder || "";
        }else if(field.type == "date"){
            input = document.createElement("input");
            input.type = "date";

        }
        fieldWrapper.appendChild(label);
        console.log("Child: ", input);
        fieldWrapper.appendChild(input);
        //add field wrapper to main container
        formContainer.appendChild(fieldWrapper);
    });

    const saveButton = document.getElementById('save-button');
        if(saveButton) {
            saveButton.style.display = 'inline-block';
        } else {
            console.error('Save button not found');
        }
}

function saveTemplate() {
        const formContainer = document.getElementById('template-form');
        const templateId = formContainer.dataset.templateId;
        const inputs = formContainer.querySelectorAll('input, textarea');

        const data = {};
        inputs.forEach(input => {
            const label = input.previousElementSibling ? input.previousElementSibling.textContent : 'Unnamed';
            data[label] = input.value;
        });

        //save to local storage 
        localStorage.setItem(`template-${templateId}`, JSON.stringify(data));
        //clears form
        formContainer.innerHTML = "";
        alert('Template data saved!!');

    }



loadProjectPlanTemplates();