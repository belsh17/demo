async function loadSemesterPlanTemps(){
    try{

        const response = await fetch("/demo/src/main/resources/static/data/education.json");
        const data = await response.json();
        const gallery = document.getElementById("template-gallery");

        data.templates
        .filter(template => template.name == "Semester Planner")
        .forEach(template => {
            const tile = document.createElement("div");
            tile.className = "template-tile4";

            tile.onclick = () => renderSemesterPlanForm(template);

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

function renderSemesterPlanForm(template){
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
        }else if(field.type == "date"){
            input = document.createElement("input");
            input.type = "date";
        } else if(field.type == "dynamic_table"){
            input = document.createElement("table");
            input.type = "dynamic_table";

            const columns = field.columns;
            if(columns){
                const header = document.createElement("tr");
                header.className = "dynamic-header";
                columns.forEach(col => {
                    const th = document.createElement("th");
                    th.textContent = col;
                    header.appendChild(th);
                });
                input.appendChild(header);

                for(let i = 0; i < 5; i++){
                    const tr = document.createElement("tr");
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

            }else{
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

        if(input){
            fieldWrapper.appendChild(label);
            console.log("Child:", input);
            fieldWrapper.appendChild(input);
            formContainer.appendChild(fieldWrapper);
        }else{
            console.error("Failed to create input for field", field);
        }
    });
    
}
loadSemesterPlanTemps();

