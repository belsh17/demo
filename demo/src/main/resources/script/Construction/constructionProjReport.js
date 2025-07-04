
//CODE FOR TOUR OR GUIDE ON EACH PAGE
window.addEventListener('load', startTour);
function startTour() {
    //check browser local storage if tour has been shown and saved already
    //TOUR TO SHOW
    if(localStorage.getItem('indivTempTourShown')){
        //so if ^^ does exist in local storage then function stops immediatly using return
        return;
    }

    // //mark tour as shown
     localStorage.setItem("indivTempTourShown", "true");


introJs().setOptions({
    steps: [
    {
        intro: "Welcome to your construction templates!! Let's take a quick tour."
    },
    {
        element: document.getElementById("template-gallery"),
        intro: "All templates for construction are displayed here."
    },
    {
        element: document.querySelector(".template-tile5"),
        intro: "Scroll down to customize your selected template."
    }

    ]
}).start();
}

//end of tour code
//END OF CODE FOR TOUR ON EACH PAGE

//CODE FOR TOKEN EXPIRY
function isJwtExpired(token){
    if(!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  const jwt = localStorage.getItem("jwt");
  if(isJwtExpired(jwt)){
    alert("Your session has expired. Please log in again.");
    localStorage.removeItem("jwt");
    window.location.href = "login.html";
  }
//END OF CODE FOR TOKEN EXPIRY
async function loadConstrucProjReportTemps(){
    try{
        const response = await fetch("/demo/src/main/resources/static/data/construction.json")
        const data = await response.json();
        const gallery = document.getElementById("template-gallery");

        data.templates
        .filter(template => template.name == "Construction Project Report")
        .forEach(template => {
            const tile = document.createElement("div");
            tile.className = "template-tile5";
            tile.onclick = () => renderConstrucReportForm(template);

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

function renderConstrucReportForm(template){
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
            input.placeholder = field.placeholder || "";
        }else if(field.type == "date"){
            input = document.createElement("input");
            input.type = "date";
        }else if(field.type == "textarea"){
            input = document.createElement("textarea");
            input.type = "textarea";
            input.placeholder = field.placeholder || "";
            input.className = "textarea-input";
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
        //ADDED FOR AUTO SAVE MORE JUST BELOW
        clearDraft();
        //END OF ADDED
     };

     loadUserProjects();

     //ADDED FOR AUTO SAVE MORE AT BOTTOM AND IN SAVE BTN CODE
     setInterval(saveDraft, 3000);
     loadDraftIfExists();
     //END OF ADDED
}

//ADDED THIS CODE FOR AUTO SAVE FEATURE and more inside renderContruct...()
const DRAFT_STORAGE_KEY = "constructionTemplateDraft";
//auto-save current form state
function saveDraft(){
    const form = document.getElementById("template-form");
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
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(fields));
}

//restore draft if it exists
function loadDraftIfExists(){
    const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if(!draft) return;

    if(!confirm("You have an unsaved draft. Would you like to restore it?")) return;

    const parsed = JSON.parse(draft);
    const form = document.getElementById("template-form");

    parsed.forEach(draftField => {
        form.querySelectorAll(".field-wrapper").forEach(wrapper => {
            const label = wrapper.querySelector("label")?.textContent || "";
            if(label === draftField.label){
                const input = wrapper.querySelector("input, textarea, table");

                if(input?.tagName === 'TABLE'){
                    const rows = draftField.value;
                    const inputRows = input.querySelectorAll("tr");
                    rows.forEach((rowData, rowIndex) => {
                        const tr = inputRows[rowIndex + 1];
                        if(!tr) return;
                        const inputs = tr.querySelectorAll("input");
                        rowData.forEach((cellVal, i) => {
                            if(inputs[i]) inputs[i].value = cellVal;
                        });
                    });
                }else{
                    input.value = draftField.value;
                }
            }
        });
    });
}

//clear draft manually
function clearDraft(){
    localStorage.removeItem(DRAFT_STORAGE_KEY);
}
//END OF ADDED
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
    loadConstrucProjReportTemps();
});
//loadConstrucProjReportTemps();

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