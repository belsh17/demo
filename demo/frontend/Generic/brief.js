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

    //code to load projects connnected to user logged in
    async function loadUserProjects(){
        const token = localStorage.getItem("jwt");

        if(!token){
            console.error("No token found. User not authenticated.");
            return;
        }

        const response = await fetch("http://localhost:8081/api/projects/user", {
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
            templateType: "Generic",
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

loadBriefTemps();