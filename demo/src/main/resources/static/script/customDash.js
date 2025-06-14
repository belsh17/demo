//load existing tasks from local storage on page load
// window.onload = function(){
//     loadTasks();
// };

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