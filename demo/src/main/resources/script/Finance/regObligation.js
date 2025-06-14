//const { createElement } = require("react");

async function loadRegObligTemplate()
{
    try{
        const response = await fetch("/demo/src/main/resources/static/data/finance.json");
        const data = await response.json();
        const gallery = document.getElementById("template-gallery");

        data.templates
        .filter(template => template.name === "Regulation Obligation Tracker")
        .forEach(template => {
            const tile = document.createElement("div");
            tile.className = "template-tile3";
            tile.onclick = () => renderRegObligTemplateForm(template);

            const img = document.createElement("img");
            img.src = template.image;
            img.alt = template.name;

            const title = document.createElement("h3");
            title.textContent = template.name;

            tile.appendChild(img);
            tile.appendChild(title);
            gallery.appendChild(tile);


        });

    } catch(error){
        console.error("Error loading templates:", error);
    }
}

//function for rendering the regulatory obligation template
function renderRegObligTemplateForm(template){
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
        if(field.type == "dynamic_table"){
            input = document.createElement("table");
            input.className = "dynamic-table";

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
                        const cellInput = document.createElement("input");
                        cellInput.type = "text";
                        cellInput.className = "dynamic-input";
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
                    cellInput.className = "dynamic-input";
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

        if(field.type == "textarea"){
            input = document.createElement("textarea");
            input.placeholder = field.placeholder || "";
            input.className = "textarea-input";
        }else{
            input = document.createElement("input");
            input.type = field.type;
            input.placeholder = field.placeholder || "";
            input.className = "text-input";
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

     const saveButton = document.getElementById("save-button");
    if(saveButton) {
        saveButton.style.display = "inline-block";
    }else{
        console.error("Save button not found");
    }


}
//code for pdf conversion and download
    async function downloadPDF() {
        const form = document.getElementById("template-form");

        const templateName = form.querySelector("h2")?.textContent || "Template";
        //use html2canvas to capture form as image
        const canvas = await html2canvas(form);
        const imgData = canvas.toDataURL("image/png");


        //chooses orientation based on template name
        const isLandscape = templateName.includes("Regulation Obligation Tracker")
        //create pdf using jsPDF library
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            //asks if it is ladnscape according to templates defined as landscape
            orientation: isLandscape ? 'landscape' : 'portrait',
            unit: 'pt',
            format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();

        //fit image to page
        const imgWidth = pageWidth - 40;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
        pdf.save(`${templateName.replace(/\s+/g, "_")}.pdf`);
    }
loadRegObligTemplate();