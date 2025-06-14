//load existing tasks from local storage on page load
// window.onload = function(){
//     loadTasks();
// };

//functionality for highlighting active page side tab
const links = document.querySelectorAll(".tab-list a");
//const currentPath = window.location.pathname.split("/").pop(); //gets file name/html
const currentURL = window.location.href;

links.forEach(link => {
    const href = link.href;
    //const href = link.getAttribute("href");
    //if(href === currentPath){
    if(currentURL.includes(href)){
        link.classList.add("active");
    }
});
//end of side tab functionality

function updateProgress(){
    const tasks = document.querySelectorAll(".task");
    const completed = [...tasks].filter(task => task.checked).length;
    const total = tasks.length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    const circle = document.getElementById("circle");
    const label = document.getElementById("progress-label");

    circle.style.setProperty('--progress', percentage);
    // const circumference = 2 * Math.PI * 25;
    // const offset = circumference - (percentage / 100) * circumference;
    // circle.style.strokeDashoffset = offset;
    label.textContent = `${percentage}%`;
}

function addTask(){
    const input = document.getElementById("task-input");
    const taskText = input.value.trim();
    if(taskText === '') return;

    const taskList = document.getElementById("task-list");

    const li = document.createElement("li");
    li.innerHTML = `<label>
                        <input type = "checkbox" class="task"> 
                        <span>${taskText}</span>
                    </label>
                    <button class="delete-btn">X</button>
                `;
    li.querySelector(".task").addEventListener("change", () => {
        saveTasks();
        updateProgress();
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
        saveTasks();
        updateProgress();
    });

    taskList.appendChild(li);
    input.value = '';
    saveTasks();
    updateProgress();
}

function saveTasks(){
    const tasks = [];
    document.querySelectorAll("#task-list li").forEach(li => {
            const checkbox = li.querySelector(".task");
            const text = li.querySelector("span").textContent;
            tasks.push({ text, completed: checkbox.checked });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks(){
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `<label>
                        <input type = "checkbox" class="task" ${task.completed ? "checked" : ""}> 
                        <span>${task.text}</span>
                    </label>
                    <button class="delete-btn">X</button>
                `;

        li.querySelector(".task").addEventListener("change", () => {
            saveTasks();
            updateProgress();
        });

        li.querySelector(".delete-btn").addEventListener("click", () => {
            li.remove();
            saveTasks();
            updateProgress();
        });

        taskList.appendChild(li);
    });

    updateProgress();
}

function clearAllTasks(){
    if(confirm("Clear all tasks?")) {
        localStorage.removeItem("tasks");
        loadTasks();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".tiles-container");

    //loading saved widgetrs from local storage 
    const savedOrder = JSON.parse(localStorage.getItem("widgetOrder"));
    if(savedOrder){
        savedOrder.forEach(id => {
            const el = document.getElementById(id);
            if(el) container.appendChild(el);
        });
    }

    //make widgets draggable
    container.querySelectorAll(".tiles-container > div").forEach(widget => {
        widget.setAttribute("draggable", true); //enables dragging

        //when the user drags
        widget.addEventListener("dragstart", (e) => {
            widget.classList.add("dragging");
            widget.style.display = ""; //shows widget again
            saveWidgetOrder();

            widget.addEventListener("dragend", () => {
                widget.classList.remove("dragging");
                saveWidgetOrder();
            });
        });
    });

    container.addEventListener("dragover", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        //find correct position
        const afterElement = getDragAfterElement(container, e.clientY);
        if(afterElement == null){
            container.appendChild(dragging);
        } else{
            container.insertBefore(dragging, afterElement);
        }
    });

    //helper: find widget directly below the dragging cursor
    function getDragAfterElement(container, y){
        const draggableElements = [...container.querySelectorAll(".tiles-container > div:not(.dragging)")];

        return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect(); //get possition of ea. widget
                const offset = y - box.top - box.height / 2;

                if(offset < 0 && offset > closest.offset){
                    return { offset: offset, element: child };
                }else{
                    return closest;
                }

        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    //save currect widget order to local storage
    function saveWidgetOrder(){
        //collect ids in order
        const order = [...container.children].map(child => child.id);
        //save as JSON string
        localStorage.setItem("widgetOrder", JSON.stringify(order));
    }

    //close button to remove widgets
    document.querySelectorAll(".close-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const widget = btn.parentElement;
            //remove from dom
            widget.remove();
            saveWidgetOrder();
        });
    });
});

//code for displaying deadlines on dashboard for all projects
async function loadDeadlines() {
    const container = document.getElementById("deadlines");
    container.innerHTML = "";

    try{
        const res = await fetch("http://localhost:8081/api/projects/deadlines");
        if(!res.ok) throw new Error("Failed to fetch deadlines");
        const projects = await res.json();

        if(projects.length === 0){
            container.innerHTML = `<p class="empty-state">No upcoming deadlines.</p>`;
            return;
        }

        const heading = document.createElement("h3");
        heading.className = "deadlines-heading";
        heading.innerHTML = "Deadlines:";
        container.appendChild(heading);
        projects.forEach(project => {
            const deadlineDate = new Date(project.deadline);
            const today = new Date();
            const diffTime = deadlineDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            const item = document.createElement("div");
            item.className = "deadline-item";
            item.innerHTML =   `
                <strong>${project.name}</strong><br>
                Deadline: ${deadlineDate.toDateString()}<br>
                ${diffDays >= 0 ? `${diffDays} days left` : `Deadline passed`}
            `;
            // container.appendChild(heading);
            container.appendChild(item);
        });
    } catch(err){
        console.error("Error loading deadlines: ", err);
        container.innerHTML = `<p class="error">Could not load deadlines.</p>`;
    }
}
//window.addEventListener("DOMContentLoaded", loadDeadlines);


//code for the graph on the dashboard
let sCurveChart = null;
 async function loadProjectOptions(){
    const res = await fetch("http://localhost:8081/api/projects");
    const projects = await res.json();
    const selector = document.getElementById("projectSelector");

    projects.forEach((p, index) => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = p.projectName;
        selector.appendChild(option);
    });

    //load first project by default to display
    if(projects.length > 0){
        loadSCurveData(projects[0].id);
    }

    selector.addEventListener("change", () => {
        const selectedId = selector.value;
        loadSCurveData(selectedId);
    });
 }

 async function loadSCurveData(projectId){
    const res = await fetch(`http://localhost:8081/api/projects/${projectId}/s-curve`);
    const data = await res.json();

    const emptyState = document.querySelector(".empty-state");

    if(data && data.length == 0){
        emptyState.style.display = "block";
    } else{
        emptyState.style.display = "none";

        const labels = data.map(p => p.date);
    const values = data.map(p => p.progressPercentage);

    if(sCurveChart){
        sCurveChart.destroy();
    }

    const ctx = document.getElementById("sCurveChart").getContext("2d");
    sCurveChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Project Progress Over Time',
                data: values,
                fill: false,
                borderColor: 'blue',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: " Progress (%) " }, min: 0, max: 100 }
            }
        }
    });

    }
 }

 //window.addEventListener("DOMContentLoaded", loadProjectOptions);

 
 async function loadTeams(){
    console.log("Calling loadTeams()...");
    const container = document.getElementById("teams");
    container.innerHTML = "";

    try{
        const response = await fetch("http://localhost:8081/api/teams/users");
        
        if(!response.ok) throw new Error("Failed to fetch teams");
        const teams = await response.json();

        if(teams.length === 0){
            container.innerHTML = `<p class="empty-state">No teams created yet.</p>`;
            return;
        }

        const heading = document.createElement("h3");
        heading.className = "teams-heading";
        heading.innerHTML = "Teams:";
        container.appendChild(heading);

        teams.forEach(team => {
            const userHtml = team.users && team.users.length > 0
            ? team.users.map(u => `<li>${u.username} (${u.email})</li>`).join("")
            : `<li>No members</li>`;

            const item = document.createElement("div");
            item.className = "team-item";
            item.innerHTML =   `
                <strong>${team.name}</strong><br>
                <ul>${userHtml}</ul>
            `;
            container.appendChild(item);
        });
    } catch(err){
        console.error("Error loading teams: ", err);
        container.innerHTML = `<p class="error">Could not load teams.</p>`;
    }
 }
  //window.addEventListener("DOMContentLoaded", loadTeams);
  window.addEventListener("DOMContentLoaded", () => {
        loadDeadlines();
        loadProjectOptions();
        loadTeams();
  });