//functionality for highlighting active page side tab
const links = document.querySelectorAll(".tab-list a");
//const currentPath = window.location.pathname.split("/").pop(); //gets file name/html
const currentURL = window.location.href;

links.forEach(link => {
    const href = link.href;
    //const href = link.getAttribute("href");
    //if(href === currentPath){
    if(currentURL.includes(href)){
        link.classList.add("active");
    }
});
//end of side tab functionality
async function loadContentMarketingTemplates(){
    try{
        const response = await fetch("/demo/src/main/resources/static/data/marketing.json");
        const data = await response.json();
        const gallery = document.getElementById("template-gallery");

        data.templates
        .filter(template => template.name == "Content Marketing Plan")
        .forEach(template => {
            const tile = document.createElement("div");
            tile.className = "template-tile1";

            const title = document.createElement("h3");
            title.className = "tile-title";
            title.textContent = template.name;

            tile.onclick = () => renderContentForm(template);

            const img = document.createElement("img");
            img.src = template.image;
            img.alt = template.name;

            tile.appendChild(img);
            tile.appendChild(title);
            gallery.appendChild(tile);
        });
    } catch(error){
        console.error("Error loading templates:", error);
    }
}

//different to table render function cause this one has array of constants
function renderContentForm(template){
    const formContainer = document.getElementById("template-form");
    formContainer.innerHTML = `<h2>${template.name}</h2>`;
    formContainer.dataset.templateId = template.id;

    //text input section
    const textInputSection = document.createElement("div");
    textInputSection.className = "text-input-section";


    //create rows for each fiweld object
    template.fields.forEach(field => {

        if(field.type == "text" && field.label){
            const label = document.createElement("label");
            label.textContent = field.label;
            label.className = "field-label";
            label.setAttribute("for", field.label);

            const input = document.createElement("input");
            input.type = "text";
            input.id = field.label;
            input.name = field.label;
            input.className = "text-input";

            const fieldContainer = document.createElement("div");
            fieldContainer.className = "field-group";
            fieldContainer.appendChild(label);
            fieldContainer.appendChild(input);

            textInputSection.appendChild(fieldContainer);

        }

    });

    formContainer.appendChild(textInputSection);

    const contentFields = template.fields.filter(f => f.Focus);

    if(contentFields.length > 0){
        const table = document.createElement("table");
        table.className = "campaign-plan-table";

        const headerRow = document.createElement("tr");
        const keys = Object.keys(contentFields[0]);

        keys.forEach(key => {
            const th = document.createElement("th");
            th.textContent = key;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        contentFields.forEach(field => {
            const tr = document.createElement("tr");
            keys.forEach(key => {
                const td = document.createElement("td");
                const input = document.createElement("input");
                input.type = "text";
                input.value = field[key] || "";
                input.className = "table-input";
                input.dataset.field = key;
                td.appendChild(input);
                tr.appendChild(td);

            });
            table.appendChild(tr);
        });
        formContainer.appendChild(table);
    }
    //formContainer.appendChild(table);

    const saveButton = document.getElementById("save-button");
    if(saveButton) {
        saveButton.style.display = "inline-block";
    }else{
        console.error("Save button not found");
    }

}

loadContentMarketingTemplates();