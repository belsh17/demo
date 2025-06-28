async function loadCampaignTemplates(){
    try{
        const response = await fetch("/demo/src/main/resources/static/data/marketing.json");
        const data = await response.json();
        const gallery = document.getElementById("template-gallery");

        data.templates
        .filter(template => template.name == "Campaign Plan")
        .forEach(template => {
            const tile = document.createElement("div");
            tile.className = "template-tile4";

            const title = document.createElement("h3");
            title.className = "tile-title";
            title.textContent = template.name;

            tile.onclick = () => renderCampaignForm(template);

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
function renderCampaignForm(template){
    const formContainer = document.getElementById("template-form");
    formContainer.innerHTML = `<h3>${template.name}</h3>`;
    formContainer.dataset.templateId = template.id;

    //create table
    const table = document.createElement("table");
    table.className = "campaign-plan-table";

    //create header row manually
    const headerRow = document.createElement("tr");
    //all objects have same key besides "isHeader"
    const keys = Object.keys(template.fields[0]).filter(k => k !== "isHeader");
    keys.forEach(key => {
        const th = document.createElement("th");
        th.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    //create rows for each fiweld object
    template.fields.forEach(field => {
        const tr = document.createElement("tr");

        if(field.isHeader){
            //if isHeader span all columns and style differently
            const th = document.createElement("th");
            th.colSpan = keys.length;
            th.textContent = field.activity;
            th.style.backgroundColor = "#ddd";
            th.style.fontWeight = "bold";
            tr.appendChild(th);
        }else{
            keys.forEach(key => {
                const td = document.createElement("td");

                if(key === "activity"){
                    td.textContent = field[key];
                }else{
                    //for normal rows, create input cells for each key
                    const input = document.createElement('input');
                    input.type = "text";
                    input.value = field[key] || "";
                    input.className = "table-input";
                    input.dataset.field = key;
                    td.appendChild(input);
                }
                tr.appendChild(td);
            });
            
        }
        table.appendChild(tr);
    });
    formContainer.appendChild(table);

    const saveButton = document.getElementById("save-button");
    if(saveButton) {
        saveButton.style.display = "inline-block";
    }else{
        console.error("Save button not found");
    }

}

loadCampaignTemplates();