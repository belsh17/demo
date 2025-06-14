// javascript loads templates from JSON file, renders them as tiles on 
// the screen, and displays a detailed form when 
// tile is clicked. Users can fill in form and save.

// loading templates. Async = tasks can run independently of main program flow
async function loadTemplates(){
    //fetching data from external file. fetch() is built in js function allows HTTP requests
    //sends a GET request to URL
    const response = await fetch("/demo/src/main/resources/static/data/finance.json");
    //extracts and parses JSON data from response object (converts raw data > js object)
    const data = await response.json();
    const gallery = document.getElementById("template-gallery");

    //display template tiles
    data.templates
    //filter to avoid duplicates
    .filter(template => template.name === "Audit Plan")
    .forEach(template => {
    //create variable tile which gets value of created div for each temp.
    const tile = document.createElement('div');
    //assign a class name to the div block
    tile.className = 'template-tile1';
    //when tile is clicked it renders the template for that form
    tile.onclick = () => renderTemplateForm(template);
    console.log("Rendering template: ", template.name, "Type:", template.type);
    //adding image and title to each tile
    const img = document.createElement('img');
    //sets image src to template image from JSON file. So fetches it and parses it
    //think of your html attribute created needs the img src and alt text
    img.src = template.image;
    img.alt = template.name;

    const title = document.createElement('h3');
    title.textContent = template.name;

    //appends both to the tile
    tile.appendChild(img);
    tile.appendChild(title);
    gallery.appendChild(tile);

    });
}
    //displaying template form
    //updates HTML content of an element with a template's name and assigns a data attribute to it
    function renderTemplateForm(template){
        //sets form container variable to form created in html
        const formContainer = document.getElementById("template-form");
        //sets HTML content - uses template literal to include template name dynamically (according to user's input)
        formContainer.innerHTML = `<h2>${template.name}</h2>`;
        //adds custom data attribute. Sets data-template-id attribute
        //dataset allows you to attach custom data to HTML elements
        formContainer.dataset.templateId = template.id;

        //dynamically generating form fields
        //loops through fields in JSON file
        template.fields.forEach(field => {
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
            input.placeholder = field.placeholder;
            input.className = "text-input";
        }else if(field.type == 'textarea'){
            //then create element textArea as if in HTML
            input = document.createElement('textarea');
            input.className = "textarea-input";
            input.placeholder = field.placeholder;
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
                //create variable th and assign html element th
                const th = document.createElement('th');
                //sets th to col data
                th.textContent = col;
                //appends th to header
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
                     cellInput.className = "row-input-audit";
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

    loadTemplates();
    // app.post('/saveTemplate', (req, res) => {
    //     const { templateId, data } = req.body;
    //     //insert data into database
    //     db.query('INSERT INTO templates (template_id, data) VALUES (?, ?)', [templateId, JSON.stringify(data)], (err) => {
    //         if (err) return res.status(500).send('Error saving template');
    //         res.send('Template saved successfully');
    //     });
    // });
    





