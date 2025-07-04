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
            //ADDED TO TEST HIDING ADD ROW BTN
            addRowBtn.setAttribute("data-html2canvas-ignore", "true");
            //END OF ADDED
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

     

    //code to load projects connnected to user logged in
    async function loadUserProjects(){
        const token = localStorage.getItem("jwt");

        if(!token){
            console.error("No token found. User not authenticated.");
            return;
        }

        const response = await fetch("http://localhost:8081/api/projects/user/display", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if(!response.ok){
            console.error("Failed to load user projects.");
            return;
        }

          const projects = await response.json();
          const selector = document.getElementById("project-selector");

          projects.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = p.projectName;
            selector.appendChild(opt);
          });
    }
    //end projects code


     document.getElementById("save-button").onclick = async () => {
        const form = document.getElementById("template-form");
        const templateId = form.dataset.templateId;
        const templateName = form.querySelector("h2")?.textContent || "Unnamed Template";

        const fields = [];
        form.querySelectorAll(".field-wrapper").forEach(wrapper => {
            const label = wrapper.querySelector("label")?.textContent || "";
            const input = wrapper.querySelector("input, textarea, table");

            if(input?.tagName === 'TABLE'){
                const tableRows = [];
                input.querySelectorAll("tr").forEach((tr, i) => {
                    if(i === 0) return; 
                    const rowValues = [];
                    tr.querySelectorAll("input").forEach(cellInput => {
                        rowValues.push(cellInput.value);
                    });
                    tableRows.push(rowValues);

                });
                fields.push({ label, type: "dynamic_table", value: tableRows });
            }else{
                fields.push({ label, type: input?.type || "text", value: input?.value });
            }
        });

        const selectedProjectId = document.getElementById("project-selector").value;
        if(!selectedProjectId){
            alert("Please select a project before saving.");
            return;
        }

        const payload = {
            templateName,
            templateType: "Finance",
            projectId: parseInt(selectedProjectId), 
            userId: getUserIdFromToken(),
            templateData: JSON.stringify(fields)
        };

        const token = localStorage.getItem("jwt")

        const response = await fetch("http://localhost:8081/api/user-templates/save", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(payload)
        });

        if(response.ok){
            alert("Template saved successfully!");
        }else{
            alert("Error saving temaplate");
        }
     };

     loadUserProjects();

}
//code for pdf conversion and download
    async function downloadPDF() {
        const form = document.getElementById("template-form");

        const templateName = form.querySelector("h2")?.textContent || "Template";
        
        //chooses orientation based on template name
        const isLandscape = templateName.includes("Regulation Obligation Tracker")
        
        // //clone form so its expanded without messing with layout
        // const clone = form.cloneNode(true);
        // clone.id = "pdf-clone";
        // clone.style.position = "absolute";
        // clone.style.left = "-9999px";
        // clone.style.top = "0";
        // clone.style.zIndex = "-1";
        // clone.style.overflow = "visible";
        // clone.style.minWidth = "max-content";
        // clone.style.maxWidth = "none";
        // clone.style.display = "block";
        // clone.style.width = "auto"
        // clone.style.padding = "20px"
        // //while testing
        // clone.style.border = "2px dashed red";
        // //clone.style.height = form.scrollHeight + "px";
        
        

        // const tables = clone.querySelectorAll("table");
        // tables.forEach(table => {
        //     table.style.width = "fit-content";
        //     table.style.maxWidth = "none";
        //     table.style.tableLayout = "auto";
        //     table.style.overflow = "visible";
        // });

        // const inputs = clone.querySelectorAll("input");
        // inputs.forEach(input => {
        //     input.style.width = "100%";
        //     input.style.boxSizing = "border-box";
        // });

        // document.body.appendChild(clone);

        // await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(clone, {
            backgroundColor: "#fff", 
            scale: 2, //used for quality
            useCORS: true
        });


        const imgData = canvas.toDataURL("image/png");
        // //create pdf using jsPDF library
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            //asks if it is ladnscape according to templates defined as landscape
            orientation: isLandscape ? 'landscape' : 'portrait',
            unit: 'pt',
            format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
        const imgWidth = canvas.width * ratio;
        const imgHeight = canvas.height * ratio;

        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;
        
        //fit image to page
        // const imgWidth = pageWidth - 40;
        // const imgHeight = canvas.height * imgWidth / canvas.width;

        // pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        //pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
        pdf.save(`${templateName.replace(/\s+/g, "_")}.pdf`);
    }

loadRegObligTemplate();