let tasks = [];
let gantt = null;

// const savedTasks = localStorage.getItem("ganttTasks");
// if(savedTasks){
//     tasks = JSON.parse(savedTasks);
// }

async function fetchTasksFromBackend(){
    const token = localStorage.getItem("jwt");
    const response = await fetch("http://localhost:8081/api/gantt/all",{
        headers: {
            "Authorization" : "Bearer " + token
        }
    });

    if(!response.ok){
        console.error("Failed to load tasks");
        return;
    }

    const data = await response.json();

    tasks = data.map(task => ({
        id: task.id,
        name: task.taskName,
        start: task.start,
        end: task.end,
        progress: task.progress
    }));

    renderGantt();
}

function renderGantt(){
    const svg = document.getElementById("gantt");
    svg.innerHTML = '';

    gantt = new Gantt("#gantt", tasks, {
        on_click: task => console.log("Clicked task:", task),
        on_date_change: (task, start, end) => {
            task.start = start;
            task.end = end;
        },
    });
}

//ADDED FOR BACKEND STORAGE
function getUserRoleFromToken(){
    const token = localStorage.getItem("jwt");
    if(!token) return null;
    try{
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.roles || null;
    }catch(e){
        return null;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const userRole = getUserRoleFromToken();
    if(userRole !== 'PROJECT_MANAGER'){
        document.getElementById("task-form").style.display = "none";
    }

    fetchTasksFromBackend();
});
//END OF ADDED

async function addTask(){
    const name = document.getElementById("task-name").value;
    const start = document.getElementById("start-date").value;
    const end = document.getElementById("end-date").value;

    if(!name || !start || !end){
        alert("Please fill in all fields");
        return;
    }

    //ADDED
    const token = localStorage.getItem("jwt");
    //END ADDED

    const newTask = {
        taskName: name,
        start: start,
        end: end,
        progress: 0
    };

    //ADDED
    const response = await fetch("http://localhost:8081/api/gantt/save", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + token
        },
        body: JSON.stringify(newTask)
    });

    if(!response.ok){
        alert("Failed to save task");
        return;
    }

    const savedTask = await response.json();
    tasks.push({
        id: savedTask.id,
        name: savedTask.taskName,
        start: savedTask.start,
        end: savedTask.end,
        progress: savedTask.progress
    });

    renderGantt();
    //END OF ADDED

    // tasks.push(newTask);
    // localStorage.setItem("ganttTasks", JSON.stringify(tasks));
    // renderGantt();

    //clear form
    document.getElementById("task-name").value = "";
    document.getElementById("start-date").value = "";
    document.getElementById("end-date").value = "";
}

renderGantt();