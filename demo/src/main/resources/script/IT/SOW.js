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
async function loadSOWTemps(){
    try{

        const response = await fetch("/demo/src/main/resources/static/data/softDev.json");
        const data = await response.json();
        const gallery = document.getElementById("template-gallery");

        data.templates
        .filter(template => template.name == "Statement of Work")
        .forEach(template => {
            const tile = document.createElement("div");
            tile.className = "template-tile5";

            tile.onclick = () => renderSOWForm(template);

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

function renderSOWForm(template){
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
        if(field.type == "text"){
            input = document.createElement("input");
            input.className = "text-input";
            input.type = "text";
            input.placeholder = field.placeholder || "";
        }else if(field.type == "date"){
            input = document.createElement("input");
            input.type = "date";
            input.className = "date-input";
        }else if(field.type == "textarea"){
            input = document.createElement("textarea");
            input.className = "textarea-input";
            input.placeholder = field.placeholder || "";
        }else if(field.type == 'table'){
            //create html table element
            input = document.createElement('table');
            input.className = "table";
            //gives variable header the created element tr
            if(field.columns && field.columns.length > 0){
                const header = document.createElement('tr');
                header.className = "table-header";
                field.columns.forEach(col => {
                //create variable th and assign html element th
                const th = document.createElement('th');
                //sets th to col data
                th.textContent = col;
                //appends th to header
                header.appendChild(th);
            });
                input.appendChild(header);
            }

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

        if(field.type == "dynamic_table"){
            const table = document.createElement("table");
            table.className = "dynamic-table";

            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");
            headerRow.className = "dynamic-header";
            const columns = field.columns;

            field.columns.forEach(col => {
                const th = document.createElement("th");
                th.textContent = col;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement("tbody");

            if(field.rows.length === 0){
                const row = document.createElement("tr");
                field.columns.forEach(() => {
                    const td = document.createElement("td");
                    const input = document.createElement("input");
                    input.type = "text";
                    input.className = "dynamic-input";
                    td.appendChild(input);
                    row.appendChild(td);
                });
                tbody.appendChild(row);
            } else{
                field.rows.forEach(rowData => {
                    const row = document.createElement("tr");
                    rowData.forEach(cell => {
                        const td = document.createElement("td");
                        const input = document.createElement("input");
                        input.type = "text";
                        input.value = cell;
                        input.className = "dynamic-input";
                        td.appendChild(input);
                        row.appendChild(td);
                    });
                    tbody.appendChild(row);
                });
            }

            table.appendChild(tbody);

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
                    cellInput.className = "dynamic-input";
                    td.appendChild(cellInput);
                    newRow.appendChild(td);
                });
                tbody.appendChild(newRow);
            };

            const dynamicTableWrapper = document.createElement("div");
            dynamicTableWrapper.className = "dynamic-table-wrapper";
            dynamicTableWrapper.appendChild(table);
            dynamicTableWrapper.appendChild(addRowBtn);
            input = dynamicTableWrapper;

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
loadSOWTemps();