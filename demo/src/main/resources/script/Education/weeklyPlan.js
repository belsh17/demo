async function loadWeeklyPlanTemps(){
    try{

        const response = await fetch("/demo/src/main/resources/static/data/education.json");
        const data = await response.json();
        const gallery = document.getElementById("template-gallery");

        data.templates
        .filter(template => template.name == "Weekly Planner")
        .forEach(template => {
            const tile = document.createElement("div");
            tile.className = "template-tile3";

            tile.onclick = () => renderWeeklyPlanForm(template);

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

function renderWeeklyPlanForm(template){
    const formContainer = document.getElementById("template-form");
    formContainer.innerHTML = `<h3>${template.name}</h3>`;
    formContainer.dataset.templateId = template.id;

    template.fields.forEach(field => {
        const label = document.createElement("label");
        label.className = "field-label";
        label.textContent = field.label;

        const fieldWrapper = document.createElement("div");
        //fieldWrapper.className = "field-wrapper";

        let input;
        if(field.type == "table"){
            input = document.createElement("table");
            input.className = "input-table";
            const header = document.createElement("tr");
            header.className = "table-header";
            
            field.columns.forEach(col => {
                const th = document.createElement("th");
                th.textContent = col;
                header.appendChild(th);
            });
            input.appendChild(header);

            field.rows.forEach(row => {
                const tr = document.createElement("tr");
                row.forEach(cell => {
                    const td = document.createElement("td");
                    const cellInput = document.createElement("input");
                    cellInput.className = "row-input";
                    cellInput.type = "text";
                    cellInput.value = cell;
                    td.appendChild(cellInput);
                    tr.appendChild(td);
                
                });
                input.appendChild(tr);
            });
        }
        //adds label to field wrapper
        fieldWrapper.appendChild(label);
        //add table to field wrapper
        console.log("Child: ", input);
        fieldWrapper.appendChild(input);
        //add field wrapper to main container
        formContainer.appendChild(fieldWrapper);
    });
}
loadWeeklyPlanTemps();