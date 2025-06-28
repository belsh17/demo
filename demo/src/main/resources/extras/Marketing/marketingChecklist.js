

async function loadChecklistTemps(){
    const response = await fetch("/demo/src/main/resources/static/data/marketing.json");
    const data = await response.json();
    const gallery = document.getElementById("template-gallery");

    data.templates
    .filter(template => template.name == "Marketing Project Plan Checklist")
    .forEach(template => {
        const tile = document.createElement("div");
        tile.className = "template-tile2";

        tile.onclick = () => renderChecklistForm(template);

        const img = document.createElement("img");
        img.src = template.image;
        img.alt = template.name;

        const title = document.createElement("h3");
        title.className = "tile-title";
        title.textContent = template.name;

        tile.appendChild(img);
        tile.appendChild(title);
        gallery.appendChild(tile);

    });

}

function renderChecklistForm(template) {
    const formContainer = document.getElementById("template-form");
    formContainer.innerHTML = `<h3>${template.name}</h3>`;
    formContainer.dataset.templateId = template.id;

  template.fields.forEach(field => {
        const fieldWrapper = document.createElement("div");
        fieldWrapper.className = "field-wrapper";
        const label = document.createElement("label");
        label.textContent = field.label;
        label.className = "field-label";

        let input;
            
        if(field.type == 'dynamic_table'){
            input = document.createElement("table");
            input.className = "dynamic-table";

            const columns = field.columns;

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


             //code to allow user to add more than 3 rows
            const addRowBtn = document.createElement("button");
            addRowBtn.textContent = "Add Row";
            addRowBtn.className = "add-row-btn";
            addRowBtn.onclick = () =>{
                const newRow = document.createElement("tr");
                field.columns.forEach(() => {
                    const td = document.createElement("td");
                    const cellInput = document.createElement("input");
                    cellInput.type = "text";
                    cellInput.className = "table-input";
                    td.appendChild(cellInput);
                    newRow.appendChild(td);
                });
                input.appendChild(newRow);
            };
            fieldWrapper.appendChild(label);
            fieldWrapper.appendChild(input);
            fieldWrapper.appendChild(addRowBtn);
            formContainer.appendChild(fieldWrapper);
            return;
            
        }
        
        if(input) {
            fieldWrapper.appendChild(label);
            //dealing with node type error
            console.log("Child: ", input);
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
loadChecklistTemps();