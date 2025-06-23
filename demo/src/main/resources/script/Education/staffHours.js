async function loadStaffHoursTemps(){
    try{

        const response = await fetch("/demo/src/main/resources/static/data/education.json");
        const data = await response.json();
        const gallery = document.getElementById("template-gallery");

        data.templates
        .filter(template => template.name == "Staff Hours")
        .forEach(template => {
            const tile = document.createElement("div");
            tile.className = "template-tile5";

            tile.onclick = () => renderStaffHoursForm(template);

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

function renderStaffHoursForm(template){
    const formContainer = document.getElementById("template-form");
    formContainer.innerHTML = `<h3>${template.name}</h3>`;
    formContainer.dataset.templateId = template.id;

    template.fields.forEach(field => {
        const label = document.createElement("label");
        label.textContent = field.label;

        const fieldWrapper = document.createElement("div");
        fieldWrapper.className = "field-wrapper";

        //date picker for auto date fill
        const mondayPicker = document.createElement("input");
        mondayPicker.type = "date";
        mondayPicker.className = "monday-picker";
        mondayPicker.onchange = () => updateTableHeaders(input, new Date(mondayPicker.value));


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
                    th.dataset.base = col;
                    header.appendChild(th);
                });

                const removeHeader = document.createElement("th");
                removeHeader.textContent = "Remove";
                header.appendChild(removeHeader);
                input.appendChild(header);

                for(let i = 0; i < 5; i++){
                    input.appendChild(createTeacherRow(columns));
                }

                const addRowBtn = document.createElement("button");
                addRowBtn.textContent = "Add Row";
                addRowBtn.className = "add-row-btn";
                //ADDED TO TEST HIDING ADD ROW BTN
                addRowBtn.setAttribute("data-html2canvas-ignore", "true");
                //END OF ADDED
                addRowBtn.onclick = () => input.appendChild(createTeacherRow(columns));

                fieldWrapper.appendChild(label);
                fieldWrapper.appendChild(document.createTextNode("Start of the week (Monday): "));
                fieldWrapper.appendChild(mondayPicker);
                fieldWrapper.appendChild(input);
                fieldWrapper.appendChild(addRowBtn);
                formContainer.appendChild(fieldWrapper);
                // return;
            }
        }

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
           templateType: "Education",
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

//function for automatically calculating teacher pay per hour
function createTeacherRow(columns){
    const tr = document.createElement("tr");

    columns.forEach(col => {
        const td = document.createElement("td");

        if(col === "Total Pay"){
            td.className = "total-pay";
            td.textContent = "0.00";

        }else if(col === "Rate per Hour"){
            const input = document.createElement("input");
            input.type = "number";
            input.step = "0.01";
            //input.type = col.includes("Date") ? "date" : "text";
            input.className = "table-input";
            input.oninput = () => updatePay(tr);

            // if(col === "Hours Worked" || col === "Rate per Hour"){
            //     input.oninput = () => updatePay(tr);
            // }

            td.appendChild(input);
        }else if(["Mon","Tue","Wed","Thu","Fri"].includes(col)){
            const input = document.createElement("input");
            input.type = "number";
            input.step = "0.25";
            //input.type = col.includes("Date") ? "date" : "text";
            input.className = "table-input";
            input.oninput = () => updatePay(tr);
             td.appendChild(input);
        }else{
            const input = document.createElement("input");
            input.type = "text";
            input.className = "table-input";
            td.appendChild(input);
        }
        tr.appendChild(td);
    });

    //remove button
    const removeTd = document.createElement("td");
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => tr.remove();
    removeTd.appendChild(removeBtn);
    tr.appendChild(removeTd);

    return tr;
}

function updatePay(row){
    const weekdayHours = [1,2,3,4,5].map(i=> parseFloat(row.cells[i]?.querySelector("input")?.value) || 0);
    //const hours = parseFloat(row.cells[2]?.querySelector("input")?.value) || 0;
    const rate = parseFloat(row.cells[6]?.querySelector("input")?.value) || 0;
    //const totalCell = row.querySelector(".total-pay");
    const total = weekdayHours.reduce((sum, hrs) => sum + hrs, 0) * rate;
    const totalCell = row.querySelector(".total-pay");
    totalCell.textContent = total.toFixed(2);
}

function updateTableHeaders(table, mondayDate){
    if(!mondayDate || isNaN(mondayDate)) return;
    const headerRow = table.querySelector("tr");
    const baseHeaders = ["Mon","Tue","Wed","Thu","Fri"];
    headerRow.querySelectorAll("th").forEach(th => {
        const base = th.dataset.base;
        if(baseHeaders.includes(base)){
            const offset = baseHeaders.indexOf(base);
            const newDate = new Date(mondayDate);
            newDate.setDate(newDate.getDate() + offset);
            const options = { month: "short", day: "numeric"};
            th.textContent = `${base} (${newDate.toLocaleDateString(undefined, options)})`;
        }
    });
}


loadStaffHoursTemps();