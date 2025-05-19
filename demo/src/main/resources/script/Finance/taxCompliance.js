//javascript to load the correct template input from JSON
async function loadTaxComplianceTemplates(){
    try{
    //sends GET request to get data from JSON
    const response = await fetch("/demo/src/main/resources/templates/JSON/finance.json");
    const data = await response.json();
    const gallery = document.getElementById("template-gallery");

    data.templates.forEach(template => {
        const tile = document.createElement('div');
        tile.className = "template-tile";
        tile.onclick = () => renderTemplateForm(template);

        //adding image and title to each tile
        const img = document.createElement('img');
        img.src = template.image;
        img.alt = template.name;

        const title = document.createElement("h3");
        tile.textContent = template.name;

        tile.appendChild(img);
        tile.appendChild(title);
        gallery.appendChild(tile);

    });
    } catch (error) {
        console.error("Error loading templates:", error);
    }
}

function renderTaxTemplateForm(template){
    const formContainer = document.getElementById("template-form");
    formContainer.innerHTML = `<h2>${template.name}<h2>`;
    formContainer.dataset.templateId = template.id;

    template.fields.forEach(field => {
        const fieldWrapper = document.createElement("div");
        fieldWrapper.className = "field-wrapper";
        const label = document.createElement("label");
        label.textContent = field.label;

        let input;
        if(field.type === 'dynamic_table'){
            input = document.createElement('table');
            input.className = "dynamic-table";

            const columns = field.columns || field.columns;

            if(columns){
                const header = document.createElement("tr");
                columns.forEach(col => {
                    const th = document.createElement("th");
                    th.textContent = col;
                    header.appendChild(th);
                });
                input.appendChild(header);

                 for(let i = 0; i < 3; i++){ //3 rows initially
                const tr = document.createElement('tr');
                field.columns.forEach(() => {
                    const td = document.createElement("td");
                    const cellInput = document.createElement("input");
                    cellInput.type = "text";
                    cellInput.className = "table-input";
                    td.appendChild(cellInput);
                    tr.appendChild(td);
                });
                input.appendChild(tr);
                } 
            }else {
                console.error("Columns not defined in template data");
            }
            //const header = document.createElement("tr");

            // field.columns.forEach(col => {
            //     const th = document.createElement("th");
            //     th.textContent = col;
            //     header.appendChild(th);
            // });
            // input.appendChild(header);
            
        }else if(field.type === "textarea"){
            input = document.createElement('textarea');
            input.placeholder = field.placeholder || "";
            input.className = "textarea-input";
        }else{
            input = document.createElement("input");
            input.type = field.type;
            input.placeholder = field.placeholder || "";
            input.className = "text-input";
        }
            
        if(input) {
            fieldWrapper.appendChild(label);
            fieldWrapper.appendChild(input);
            formContainer.appendChild(fieldWrapper);
        } else {
            console.error("Failed to create input for field", field);
        }
        
    });

    const saveButton = document.getElementById("save-button");
    if(saveButton) {
        saveButton.style.display = "inline-block";
    }else{
        console.error("Save button not found");
    }
}
loadTaxComplianceTemplates();