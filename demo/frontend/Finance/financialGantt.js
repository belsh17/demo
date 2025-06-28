async function loadGanttTemplates(){
    const response = await fetch("/demo/src/main/resources/static/data/finance.json");
    const data = await response.json();
    const gallery = document.getElementById("template-gallery");

    data.templates
    .filter(template => template.name == "Financial Reporting Timeline")
    .forEach(template => {
        const tile = document.createElement("div");
         
        tile.className = 'template-tile4';
        //when tile is clicked it renders the template for that form
        tile.onclick = () => {
            const ganttField = template.fields.find(f => f.type === "gantt");
            if(ganttField){
                renderGanttChart(ganttField.tasks);
            }else{
                console.warn("No Gantt tasks found in template.")
            }
        };
        //renderGanttChart(template);
        //console.log("Rendering template: ", template.name, "Type:", template.type);
        

        const img = document.createElement("img");
        img.src = template.image;
        img.alt = template.name;

       const title = document.createElement("h3");
       title.textContent = template.name;

       tile.appendChild(img);
       tile.appendChild(title);
       gallery.appendChild(tile);
    });
}
function renderGanttChart(tasks){
    let container = document.getElementById("gantt-target");
    container.innerHTML = "";

    const formattedTasks = tasks.map(task => ({
            id: task.id,
            name: task.name,
            start: task.start,
            end: task.end,
            progress: parseInt(task.progress, 10),
            dependencies: task.dependencies || ""
    }));

    if(window.Gantt){
        new window.Gantt("#gantt-target", formattedTasks, {
        view_mode: "Week",
        date_format: "YYYY-MM-DD",
        custom_popup_html: null
    });
    }else{
        console.error("Frappe Gantt Library not loaded");
    }


}
document.addEventListener("DOMContentLoaded", loadGanttTemplates);