
async function loadprofitLosstemplate(){
    const response = await fetch("/demo/src/main/resources/static/data/finance.json")
    const data = await response.json();
    const gallery = document.getElementById("template-gallery");

    data.templates
    .filter(template => template.name == "Profit and Loss Report")
    .forEach(template => {
        const tile = document.createElement("div");
         
        tile.className = 'template-tile5';
        //when tile is clicked it renders the template for that form
        tile.onclick = () => renderProfitTemplateForm(template);
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

//displaying template form
    //updates HTML content of an element with a template's name and assigns a data attribute to it
    // function renderProfitTemplateForm(template){
    function renderProfitTemplateForm(template, yearValues = {}) {
        //sets form container variable to form created in html
        const formContainer = document.getElementById("template-form");
        //sets HTML content - uses template literal to include template name dynamically (according to user's input)
        formContainer.innerHTML = `<h2>${template.name}</h2>`;
        //adds custom data attribute. Sets data-template-id attribute
        //dataset allows you to attach custom data to HTML elements
        formContainer.dataset.templateId = template.id;

        let yearInputs = [];
        //dynamically generating form fields
        //loops through fields in JSON file
        template.fields.forEach((field, index) => {
        //creates wrapper div for each field
        const fieldWrapper = document.createElement("div");
        fieldWrapper.className = "field-wrapper";
        //creates label element for each field
        const label = document. createElement("label");
        label.textContent = field.label;
        label.className = "field-label";

        //different fields 
        let input;
        if(field.type == 'text'){
            //then create element input as if in HTML
            input = document.createElement('input');
            //sets input type to text
            input.type = 'text';
            input.className = "text-input";
            input.placeholder = field.placeholder || '';
            input.value = yearValues[field.label] || '';

            if(/Year\s*\d/.test(field.label)){
                 yearInputs.push({ label: field.label, input});
            }

        }else if(field.type == 'date'){
            //then create element textArea as if in HTML
            input = document.createElement('input');
            input.type = "date";
            // input.placeholder = field.placeholder;
            //field is table type
        }else if(field.type == 'table'){
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

                if(col.includes("Year")){
                        const inputYear = document.createElement("input");
                        inputYear.type = "text";
                        inputYear.value = col;
                        inputYear.className = "year-header";
                        th.appendChild(inputYear);
                    } else {
                        th.textContent = col;
                    }
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
                    const cellInput = document.createElement('input');
                    /* styling for weekly plan row input */
                    cellInput.className = "row-input";
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

       // input.addEventListener("input", debounceRender);

         const saveButton = document.getElementById('save-button');
        if(saveButton) {
            saveButton.style.display = 'inline-block';
        } else {
            console.error('Save button not found');
        }
        //document.getElementById('save-button').style.display = 'block';
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


loadprofitLosstemplate();   