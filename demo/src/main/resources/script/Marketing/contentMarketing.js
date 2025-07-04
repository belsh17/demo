//functionality for highlighting active page side tab
// const links = document.querySelectorAll(".tab-list a");
// //const currentPath = window.location.pathname.split("/").pop(); //gets file name/html
// const currentURL = window.location.href;

// links.forEach(link => {
//     const href = link.href;
//     //const href = link.getAttribute("href");
//     //if(href === currentPath){
//     if(currentURL.includes(href)){
//         link.classList.add("active");
//     }
// });
//end of side tab functionality
async function loadContentMarketingTemplates(){
    try{
        const response = await fetch("/demo/src/main/resources/static/data/marketing.json");
        const data = await response.json();
        const gallery = document.getElementById("template-gallery");

        data.templates
        .filter(template => template.name == "Content Marketing Plan")
        .forEach(template => {
            const tile = document.createElement("div");
            tile.className = "template-tile1";

            const title = document.createElement("h3");
            title.className = "tile-title";
            title.textContent = template.name;

            tile.onclick = () => renderContentForm(template);

            const img = document.createElement("img");
            img.src = template.image;
            img.alt = template.name;

            tile.appendChild(img);
            tile.appendChild(title);
            gallery.appendChild(tile);
        });
    } catch(error){
        console.error("Error loading templates:", error);
    }
}

//different to table render function cause this one has array of constants
function renderContentForm(template){
    const formContainer = document.getElementById("template-form");
    formContainer.innerHTML = `<h2>${template.name}</h2>`;
    formContainer.dataset.templateId = template.id;

    //text input section
    const textInputSection = document.createElement("div");
    textInputSection.className = "text-input-section";


    //create rows for each fiweld object
    template.fields.forEach(field => {

        if(field.type == "text" && field.label){
            const label = document.createElement("label");
            label.textContent = field.label;
            label.className = "field-label";
            label.setAttribute("for", field.label);

            const input = document.createElement("input");
            input.type = "text";
            input.id = field.label;
            input.name = field.label;
            input.className = "text-input";

            const fieldContainer = document.createElement("div");
            fieldContainer.className = "field-group";
            fieldContainer.appendChild(label);
            fieldContainer.appendChild(input);

            textInputSection.appendChild(fieldContainer);

        }

    });

    formContainer.appendChild(textInputSection);

    const contentFields = template.fields.filter(f => f.Focus);

    if(contentFields.length > 0){
        const table = document.createElement("table");
        table.className = "campaign-plan-table";

        const headerRow = document.createElement("tr");
        const keys = Object.keys(contentFields[0]);

        keys.forEach(key => {
            const th = document.createElement("th");
            th.textContent = key;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        contentFields.forEach(field => {
            const tr = document.createElement("tr");
            keys.forEach(key => {
                const td = document.createElement("td");
                const input = document.createElement("input");
                input.type = "text";
                input.value = field[key] || "";
                input.className = "table-input";
                input.dataset.field = key;
                td.appendChild(input);
                tr.appendChild(td);

            });
            table.appendChild(tr);
        });
        formContainer.appendChild(table);
    }
    //formContainer.appendChild(table);

    
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
           templateType: "Marketing",
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

loadContentMarketingTemplates();