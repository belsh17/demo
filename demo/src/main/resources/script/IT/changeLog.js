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
async function loadChangeLogTemps(){
    try{

        const response = await fetch("/demo/src/main/resources/static/data/softDev.json");
        const data = await response.json();
        const gallery = document.getElementById("template-gallery");

        data.templates
        .filter(template => template.name == "Change Log")
        .forEach(template => {
            const tile = document.createElement("div");
            tile.className = "template-tile2";

            tile.onclick = () => renderChangeLogForm(template);

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

function renderChangeLogForm(template){
    const formContainer = document.getElementById("template-form");
    formContainer.innerHTML = `<h2>${template.name}</h2>`;
    formContainer.dataset.templateId = template.id;

    template.fields.forEach(field => {
            const label = document.createElement("label");
            label.className = "field-label";
            label.textContent = field.label;

            const fieldWrapper = document.createElement("div");
            fieldWrapper.className = "field-wrapper";

            let input;
            if(field.type == "text"){
                input = document.createElement("input");
                input.type = "text";
                input.placeholder = field.placeholder;
               
            }else if(field.type == "dynamic_table"){
                input = document.createElement("table");
                input.className = "dynamic_table";

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

                    for(let i = 0; i < 4; i++){
                        const tr = document.createElement("tr");
                        field.columns.forEach(() => {
                            const td = document.createElement("td");
                            //const cellInput = document.createElement("input");
                            const cellInput = document.createElement("textarea");
                            cellInput.type ="text";
                            //cellInput.className = "dynamic-input";
                            cellInput.className = "description-cell";
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
                        //const cellInput = document.createElement("input");
                        const cellInput = document.createElement("textarea");
                        cellInput.type = "text";
                        cellInput.className = "description-cell";
                        //cellInput.className = "dynamic-input";
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
    });
}
loadChangeLogTemps();