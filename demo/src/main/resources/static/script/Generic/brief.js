async function loadBriefTemps(){
    const response = await fetch("/demo/src/main/resources/static/data/generic.json");
    const data = await response.json();
    const gallery = document.getElementById("template-gallery");

    data.templates
    .filter(template => template.name == "Project Brief")
    .forEach(template => {
        const tile = document.createElement("div");
        tile.className = "template-tile1";

        tile.onclick = () => renderBriefForm(template);

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
}

function renderBriefForm(template){
    const formContainer = document.getElementById("template-form");

    //ADDED
    //formContainer.style.display = "block";
    // formContainer.style.visibility = "visible";
    // formContainer.style.position = "static";
    // formContainer.style.left = "0";
    //END OF ADDED

    formContainer.innerHTML = `<h3>${template.name}</h3>`;
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
        }else if(field.type == "table"){
                 //create html table element
            input = document.createElement('table');
            input.className = "table";
            //gives variable header the created element tr
            const header = document.createElement('tr');
            header.className = "table-header";
            //loops through each column
            field.columns.forEach(col => {
            //updateCols.forEach(col => {
                //create variable th and assign html element th
                const th = document.createElement('th');

                th.textContent = col;
                header.appendChild(th);
            });
            input.appendChild(header);

            //loops through rows from JSON
            field.rows.forEach(row => {
                //creates new table row
                const tr = document.createElement('tr');
                //loops thrpugh cells within the row
                row.forEach(cell => {
                    //create new table cell
                    const td = document.createElement('td');
                    //create an input field
                    const cellInput = document.createElement('textarea');
                    cellInput.className = "table-input";
                    //set input type to text
                    cellInput.type = 'text';
                    //set input value to cell content
                    cellInput.value = cell;
                    //add input field to table cell
                    td.appendChild(cellInput);
                    //add cell to current row
                    tr.appendChild(td);
                });
                //add the row to the table
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

    const saveButton = document.getElementById("save-button");
    if(saveButton) {
        saveButton.style.display = "inline-block";
    }else{
        console.error("Save button not found");
    }
}

loadBriefTemps();