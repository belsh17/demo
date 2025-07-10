// javascript loads templates from JSON file, renders them as tiles on 
// the screen, and displays a detailed form when 
// tile is clicked. Users can fill in form and save.

// loading templates. Async = tasks can run independently of main program flow
async function loadProgressReportTemplates(){
    //fetching data from external file. fetch() is built in js function allows HTTP requests
    //sends a GET request to URL
    const response = await fetch("/demo/src/main/resources/static/data/construction.json");
    //extracts and parses JSON data from response object (converts raw data > js object)
    const data = await response.json();
    const gallery = document.getElementById("template-gallery");

    //display template tiles
    data.templates
    //filter to avoid duplicates
    .filter(template => template.name === "Progress Report")
    .forEach(template => {
    //create variable tile which gets value of created div for each temp.
    const tile = document.createElement('div');
    //assign a class name to the div block
    tile.className = 'template-tile1';
    //when tile is clicked it renders the template for that form
    tile.onclick = () => renderProgressReportForm(template);
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
    function renderProgressReportForm(template){
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
        if(field.type == 'textarea'){
            //then create element textArea as if in HTML
            input = document.createElement('textarea');
            input.placeholder = field.placeholder;
            input.className = "textarea-input";
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
                    //cellInput.className = "row-input";
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
            templateType: "Construction",
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

        //ADDED FOR PDF BTN HIDE
        //form.classList.add("pdf-export");
        // const buttons = form.querySelectorAll("button");
        // buttons.forEach(btn => btn.style.display = "none");
        //END OF ADDED

        const templateName = form.querySelector("h2")?.textContent || "Template";
        //use html2canvas to capture form as image
        const canvas = await html2canvas(form);

        //ADDED FOR PDF BTN HIDE
        //form.classList.remove("pdf-export");
        // buttons.forEach(btn => btn.style.display = "");
        //HIDE BTN
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

document.addEventListener("DOMContentLoaded", function(){
  loadProgressReportTemplates();
});

//ADD THIS TO THE OTHER TEMPLATES
function getUserIdFromToken(){
    const token = localStorage.getItem("jwt");
    if(!token) return null;

    try{
        const payload = JSON.parse(atob(token.split('.')[1]));

        return payload.userId || payload.id || payload.sub || null;

    }catch(e){
        console.error("Invalid JWT token:", e);
        return null;
    }
}
    //loadProgressReportTemplates();
   
    





