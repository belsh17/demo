document.addEventListener("DOMContentLoaded", async() => {
    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get("templateId");

    const token = localStorage.getItem("jwt");
    if(!token || !templateId){
        alert("Invalid access.");
        return;
    }

    try{
        const res = await fetch(`http://localhost:8081/api/user-templates/${templateId}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        //if(!res.ok) throw new Error("Template not found");
        if(!res.ok){
            throw new Error(`Server responded with status: ${res.status}`);
        }
        
        const template = await res.json();

        //ADDING THIS FOR JSON EDITING
        const data = JSON.parse(template.templateData);

        renderTemplateForm(data);
        //END OF ADDITIONS
        document.getElementById("templateName").value = template.templateName;
        document.getElementById("templateType").value = template.templateType;
        //COMMMENTED OUT PART OF ADDITIONS
        //document.getElementById("templateData").value = JSON.stringify(template.templateData, null, 2);
    } catch(err){
        console.error(err);
        alert("Failed to load template.");
        return;
    }
});

function renderTemplateForm(data){
    const form = document.getElementById("template-form");
    form.innerHTML = "" //clear any existing form elements

    data.forEach((field, index) => {
        const fieldWrapper = document.createElement("div");
        const label = document.createElement("label");
        label.textContent = field.label;

        if(field.type === "text" || field.type === "date"){
            const input = document.createElement("input");
            input.type = field.type;
            input.name = `field-${index}`;
            input.value = field.value || "";
            input.dataset.index = index;
            fieldWrapper.appendChild(label);
            fieldWrapper.appendChild(input);
        }else if (field.type === "dynamic_table"){
            const table = document.createElement("table");
            table.dataset.index = index;

            field.value.forEach((row, rowIndex) => {
                const tr = document.createElement("tr");
                row.forEach((cell, colIndex) => {
                    const td = document.createElement("td");
                    const input = document.createElement("input");
                    input.type = "text";
                    input.value = cell;
                    input.dataset.row = rowIndex;
                    input.dataset.col = colIndex;
                    input.dataset.index = index;
                    td.appendChild(input);
                    tr.appendChild(td);
                });
                table.appendChild(tr);
            });

            fieldWrapper.appendChild(label);
            fieldWrapper.appendChild(table);
        }
        form.appendChild(fieldWrapper);
    });
}

async function saveUpdatedTemplate(){
    const templateId = new URLSearchParams(window.location.search).get("templateId");
    const token = localStorage.getItem("jwt");

    //ADDED commmented out was working before 2
    

    // const updatedTemplate = {
    //     templateName: document.getElementById("templateName").value,
    //     templateType: document.getElementById("templateType").value,
    //     //COMMMENTED OUT PART OF ADDITIONS
    //     //templateData: JSON.parse(document.getElementById("templateData").value)
    //     //ADDED
    //     //templateData: []
    //     templateData: JSON.stringify(templateDataArray)
    // };
    //END OF COMMMENTED OUT

    const form = document.getElementById("template-form");

    const elements = Array.from(form.children);
    const templateDataArray = [];
    elements.forEach((wrapper, i) => {
        const label = wrapper.querySelector("label").textContent;
        const input = wrapper.querySelector("input");

        if(input && (input.type === "text" || input.type === "date")){
            //updatedTemplate.templateData.push({
            templateDataArray.push({
                label,
                type: input.type,
                value: input.value
            });
        }else{
            const table = wrapper.querySelector("table");
            const rows = Array.from(table.rows);
            const tableData = rows.map(row => {
                return Array.from(row.cells).map(cell => {
                    return cell.firstChild.value;
                });
            });

            //updatedTemplate.templateData.push({
            templateDataArray.push({
                label,
                type: "dynamic_table",
                value: tableData
            });
        }
    });
    //END OF ADDED

    const updatedTemplate = {
        templateName: document.getElementById("templateName").value,
        templateType: document.getElementById("templateType").value,
        //COMMMENTED OUT PART OF ADDITIONS
        //templateData: JSON.parse(document.getElementById("templateData").value)
        //ADDED
        //templateData: []
        templateData: JSON.stringify(templateDataArray)
    };
    try{
        const res = await fetch(`http://localhost:8081/api/user-templates/update/${templateId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(updatedTemplate)
        });

        if(!res.ok) {
            console.log("Status:", res.status);
            const errorText = await res.text();
            console.log("server response:", errorText);
            throw new Error("Update failed");
        }

        alert("template updated!");
        window.location.href = "oneProject.html"
    }catch(err){
        console.error(err);
        alert("Failed to update template");
    }
}