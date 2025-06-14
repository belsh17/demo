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
async function loadSignOffTemps(){
    try{

        const response = await fetch("/demo/src/main/resources/static/data/softDev.json");
        const data = await response.json();
        const gallery = document.getElementById("template-gallery");

        data.templates
        .filter(template => template.name == "Sign Off Document")
        .forEach(template => {
            const tile = document.createElement("div");
            tile.className = "template-tile4";

            tile.onclick = () => renderSignOffForm(template);

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

function renderSignOffForm(template){
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
        }else if(field.type == 'radio'){
            //then create element textArea as if in HTML
            input = document.createElement('div');
            input.className = "radio-group";
            
            field.options.forEach(option => {
                const radioWrapper = document.createElement("label");
                radioWrapper.className = "radio-wrapper";

                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = field.label;
                radio.value = option;

                const radioText = document.createTextNode(option);
                radioWrapper.appendChild(radio);
                radioWrapper.appendChild(radioText);
                input.appendChild(radioWrapper);
            });
            //field is table type
        }else if(field.type == 'date'){
            //then create element textArea as if in HTML
            input = document.createElement('input');
            input.type = "date";
            input.className = "date-input";
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
                    const cellInput = document.createElement('input');
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
loadSignOffTemps();