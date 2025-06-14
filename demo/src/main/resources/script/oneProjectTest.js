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
let users = [];
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("id");
async function getProjectDetails(){
    //fetch projects details
    return fetch(`http://localhost:8081/api/projects/${projectId}`)
    .then(res => res.json())
    .catch(error => {
        console.log("Error fetching from backend: " + error);
        return [];
    });
}

//fetch for tasks once created and saved
async function getTaskDetails(){
    return fetch(`http://localhost:8081/api/projects/${projectId}/tasks`)
    // return fetch("http://localhost:8081/api/tasks")
    .then(res => res.json())
    .catch(error => {
        console.log("Error fetching from backend: " + error);
        return [];
    });
}

//needed for creating new tasks with user assigned
async function getUserDetails(){
    const token = localStorage.getItem("jwt");
     if(!token){
                alert("No token found. Please log in again");
                return [];
            }
    try {
        const res = await fetch("http://localhost:8081/api/users", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if(!res.ok) {
        if(res.status === 401){
            alert("Session expired. Please log in again.");
            localStorage.removeItem("jwt");
            window.location.href = "/login.html";
            return [];
        } else {
            throw new Error("Unauthorized.");
        }
    }

    const data = await res.json();
    return data;

    } catch(error) {
        console.log("Error fetching from backend: " + error);
        return [];
    }
}

//fetch for tasks once created and saved
async function getTeamDetails(projectId){
    const token = localStorage.getItem("jwt");
     if(!token){
                alert("No token found. Please log in again");
                return [];
            }
    try {
        const res = await fetch(`http://localhost:8081/api/projects/${projectId}/teams`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if(!res.ok) {
        if(res.status === 401){
            alert("Session expired. Please log in again.");
            localStorage.removeItem("jwt");
            window.location.href = "/login.html";
            return [];
        } else {
            throw new Error("Unauthorized.");
        }
    }

    const data = await res.json();
    return data;

    } catch(error) {
        console.log("Error fetching from backend: " + error);
        return [];
    }


    // return fetch(`http://localhost:8081/api/projects/${projectId}/teams`)
    // .then(res => res.json())
    // .catch(error => {
    //     console.log("Error fetching from backend: " + error);
    //     return [];
    // });
}

//function to fetch existing project files
    async function getProjectFiles(projectId){
        const token = localStorage.getItem("jwt");
        if(!token){
            alert("No token found. PLease log in again");
            return [];
        }

        try{
            const res = await fetch(`http://localhost:8081/api/projects/${projectId}/files`,{
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            if(!res.ok){
                if(res.status === 401){
                    alert("Session expired. Please log in again");
                    localStorage.removeItem("jwt");
                    window.location.href = "/login.html";
                    return [];
                }else{
                    throw new Error("Failed to fetch project files.");
                }
            }

            const data = await res.json();
            return data;
        }catch(error){
            console.log("Error fetching project files: " + error);
            return [];
        }
    }


let relatedTasks = [];

document.addEventListener("DOMContentLoaded", async () => {
    //can only use await with async
    const project = await getProjectDetails();
    const container = document.querySelector(".main-content > .projects-display");

    if(!container){
        console.error("Projects container not found");
        return;
    }


    if(!project || !project.id){
        container.innerHTML = "<p>Project not found.</p>";
        return;
    }

    const header = document.getElementById("title-block");
    if(header){
        header.innerHTML = `<h1>${project.projectName}</h1>`;
    }
    
    const projectDisplay = document.querySelector(".projects-display");
    const projectBlock =document.getElementById("project-block");

    projectBlock.innerHTML = `
            <h3 class="project-title1">Project Details: </h3>
            <p class="project-description"><strong>Description: </strong>${project.projDescription}</p>
            <p class="project-details"><strong>Client: </strong> ${project.client.name}</p>
            <p class="project-details"><strong>Project Manager: </strong> ${project.projectManager.name}</p>
            <p class="project-details"><strong>Start Date: </strong> ${project.startDate}</p>
            <p class="project-details"><strong>Deadline: </strong> ${project.deadlineDate}</p>
        `;
        //projectDisplay.appendChild(projectBlock);
    //end code for project div

    //code for tasks
    const task = await getTaskDetails();
    //ADDED THIS
    //const relatedTasks = task.filter(task => Number(task.project.id) === Number(project.id));
    
    //store results from users fetch in an array
    users = await getUserDetails();
    console.log("Users fetched from backend:", users);

    relatedTasks = task.filter(task => task.projectId === project.id);
    const taskBlock = document.getElementById("task-block");
    if(!taskBlock){
        console.error("Task block not found in DOM");
    }

    function getUserNameById(userId){
        const user = users.find(u => u.id === userId);
        return user ? user.name : "Unknown";
    }
    //function to render updated tasks
        function renderUpdatedTasks(){
            //Reuse updated task rendering and event logic here
             taskBlock.innerHTML = `
                <h3 class="task-title1">Tasks: </h3>
                <div class="task-list">
                    ${
                        relatedTasks.length > 0
                        ? relatedTasks.map(task => ` 
                            <div class="task-item">
                                <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${task.taskStatus === "Complete" ? "checked" : ""}>MARK COMPLETE</input>
                                <h4 class="dead-text1">${task.name || task.taskName}</h4>
                                <p class="dead-text1"><strong>Description: </strong> ${task.description || task.taskDescription}</p>
                                <p class="dead-text1"><strong>Due: </strong> ${task.dueDate}</p>
                                <p class="dead-text1"><strong>Status: </strong> <span id="status-${task.id}">${task.taskStatus}</span></p>
            
                                <p class="dead-text1"><strong>Assigned to: </strong>${getUserNameById(task.assignedUserId)}</p>
                            </div>
                        `).join("")
                    : "<p>No tasks for this project.</p>"
                }
                </div>
                <input type="text" id="new-task-name" placeholder="New task name">
                <input type="text" id="new-task-description" placeholder="Task description">
                <input type="date" id="new-task-due-date">
                <select id="user-assigned-dropdown">
                    <option value="" disabled selected>Select a user</option>
                    ${users.map(user => `<option value="${user.id}">${user.fullName || user.name}</option>`).join("")}
                </select>
                <button type="submit" id="add-task-btn">Add Task</button>
                `;
                //projectDisplay.appendChild(taskBlock);
                attachTaskEventListener();
            }
        function attachTaskEventListener(){
        document.querySelectorAll(".task-checkbox").forEach(checkbox => {
            checkbox.addEventListener("change", (e) => {
                const taskId = parseInt(e.target.dataset.taskId);
                const task = relatedTasks.find(t => t.id === taskId);
                if(task){
                    task.taskStatus = e.target.checked ? "Complete" : "Incomplete";
                    document.getElementById(`status-${task.id}`).innerText = task.taskStatus;
                    updateProgressBar(relatedTasks);
                }
            });
        }); 

        //add new task if none created already
        document.getElementById("add-task-btn").addEventListener("click", async() => {
            
            const nameInput = document.getElementById("new-task-name");
            const newTaskName = nameInput.value.trim();
            const descriptionInput = document.getElementById("new-task-description");
            const newTaskDescription = descriptionInput.value.trim();
            const dueDateInput = document.getElementById("new-task-due-date");
            const newTaskDueDate = dueDateInput.value;
            const userSelect = document.getElementById("user-assigned-dropdown");
            const assignedUserId = parseInt(userSelect.value);

            if(!newTaskName) return;

            const newTask = {
                //id: Date.now(),
                taskName: newTaskName,
                taskDescription: newTaskDescription,
                //creationDate: new Date().toISOString().split("T")[0],
                //creationDate: newTaskDueDate ? new Date().toISOString().split("T")[0] : null,
                taskStatus: "Incomplete",
                dueDate: newTaskDueDate,
                //projectId: project.id,
                assignedUserId: assignedUserId
                
            };

            try{
                const token = localStorage.getItem("jwt");
                if(!token){
                alert("No token found. Please log in again");
                return [];
            }
                const res = await fetch(`http://localhost:8081/api/projects/${projectId}/tasks`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify(newTask)
                });
                if(!res.ok) {
                    throw new Error("Failed to add task.");
                }

            console.log("Sending task to backend: ", newTask);
            const savedTask = await res.json();
            relatedTasks.push(savedTask);

            nameInput.value = "";
            descriptionInput.value = "";
            dueDateInput.value = "";
            userSelect.selectedIndex = 0;

            //Re-render the whole task block
            //taskBlock.innerHTML = "";
            renderUpdatedTasks();
            updateProgressBar(relatedTasks);
            }catch(error){
                console.error("Error saving task to backend: " , error);
                alert("Failed to save task.");
            }
        });
   }
   renderUpdatedTasks();
    //end code for tasks div

    //start code for teams div
    //const relatedTeams = teams.filter(team => team.projectId === project.id);
    const relatedTeams = await getTeamDetails(projectId); 
    console.log("Teams data fetched:", relatedTeams);  
        const teamBlock = document.getElementById("team-block");
            teamBlock.innerHTML = relatedTeams && relatedTeams.teamName
            ? `<h3><strong>Team Name: </strong>${relatedTeams.teamName}</h3>`
            : "<p> No team linked for this project</p>";
    //end code for teams div

    //start code files div

    async function uploadFiles(){
        //load existing files first
        const existingFiles = await getProjectFiles(projectId);
        const filesBlock = document.getElementById("files-block");

        filesBlock.innerHTML = `
            <h3 id="file-title"><strong>Upload project files: </strong></h3>
            <button type="button" id="upload-button">ADD FILE</button>
            <input type="file" id="file-input" style="display: none;" multiple />
            <ul id="file-list"></ul>
        `;

        //display existing files immediatly
        displayProjectFiles(existingFiles);

        const fileInput = document.getElementById("file-input");
        const uploadButton = document.getElementById("upload-button");

        uploadButton.addEventListener("click", () => {
                fileInput.click();
        });

        fileInput.addEventListener("change", async () => {
        const files = fileInput.files;

        if(files.length === 0){
            alert("Please select a file to upload");
            return;
        }

        const formData = new FormData();
        for(let file of files) {
            formData.append("files", file); //append ea file
        }

        //add project id to associate files with this project
        formData.append("projectId", projectId);

        
        try{
            const token = localStorage.getItem("jwt");
            const response = await fetch(`http://localhost:8081/api/projects/${projectId}/files/upload`, {
                method:"POST",
                headers: {
                    "Authorization": "Bearer " + token
                },
                body: formData
            });

         if(response.ok){
            const uploadedFiles = await response.json();
            console.log("Files uploaded successfully: ", uploadFiles);

            //refresh the file to show all project files
            const updatedFiles = await getProjectFiles(projectId);
            displayUploadedFiles(updatedFiles);

            //clear file input
            fileInput.value = "";

            alert(`${files.length} file(s) uploaded successfully!`);
        }else{
            const errorText = await response.text();
            console.error("Upload failed:", errorText);
            alert("Upload failed." + errorText);
        }
    }catch (error){
            console.error("Error uploading file: ", error);
            alert("Error uploading file." + error.message);
    }

    });
    
    }
    uploadFiles();

    //end code for files
});

function updateProgressBar(taskList){
            const progressContainer = document.getElementById("progress-bar-container");
            const total = taskList.length;
            const completed = taskList.filter(t => t.taskStatus === "Complete").length;
            const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
            const barColor = percent === 100 ? "green" : percent >= 50 ? "orange" : "red";

            progressContainer.innerHTML = `
            <h3 id="progress-title">Project Progress: ${percent}%</h3>
            <div style="width:100%; background:#e0e0e0; border-radius: 10px; height: 20px; transition: width 0.5s;">
                <div style="width:${percent}%; background: ${barColor}; height: 100%; border-radius: 10px;"></div>
            </div>
            `;
        }


    function displayProjectFiles(fileList){
        const listContainer = document.getElementById("file-list");

        if(!fileList || fileList.length === 0){
            listContainer.innerHTML = "<p> No files uploaded for this project yet.</p>";
            return;
        }

        listContainer.innerHTML = "<h4>Uploaded Files:</h4>";

        const fragment = document.createDocumentFragment();

        fileList.forEach(file => {
            const fileDiv = document.createElement("div");
            fileDiv.className = "file-item";
            fileDiv.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #ddd; margin: 4px 0; border-radius: 4px;";

            const fileLink = document.createElement("a");
            fileLink.href = `http://localhost:8081/api/files/${file.id}`;
            fileLink.target = "_blank";
            fileLink.target = file.filename || file.originalName || file.fileName | "Unknown file";
            fileLink.style.cssText = "text-decoration: none; color: #007bff; flex-grow: 1;";

            //add file size
            const fileInfo = document.createElement("span");
            fileInfo.style.cssText = "color: #666; font-size: 0.9em; margin-left: 10px;";
            if(file.size){
                fileInfo.textContent = formatFileSize(file.size);
            }

            //delete button to delete file
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.style.cssText = "background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; margin-left: 10px;";
            deleteBtn.onclick = () => deleteProjectFile(file.id);

            fileDiv.appendChild(fileLink);
            if(file.size) fileDiv.appendChild(fileInfo);
            fileDiv.appendChild(deleteBtn);
            fragment.appendChild(fileDiv);
        });

        listContainer.appendChild(fragment);
    }

    function formatFileSize(bytes){
        if(bytes === 0) return '0 bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    //functionto format file size!

    async function deleteProjectFile(fileId){
        if(!confirm("Are you sure you want to delete this file?")){
            return;
        }

        const token = localStorage.getItem("jwt");
        if(!token){
            alert("No token found. Please log in again");
            return;
        }

        try{
            const response = await fetch(`http://localhost:8081/api/projects/${projectId}/files/${fileId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            if(response.ok){
                const updatedFiles = await getProjectFiles(projectId);
                displayProjectFiles(updatedFiles);
                alert("File deleted successfully");
            }else{
                const errorText = await response.text();
                console.error("Delete failed:" , errorText);
                alert("Failed to delete file: " + errorText);
            }
        }catch(error){
            console.error("Error deleting file: ", error);
            alert("Error deleting file: " + error.message);
        }
    }
        //renderUpdatedTasks();
        // updateProgressBar(relatedTasks);

        // <p class="dead-text1"><strong>Assigned to: </strong>${getUserNameById(task.userAssigned)}</p>

    // const filesBlock = document.getElementById("files-block");

        // function uploadFiles(){
        //     filesBlock.innerHTML = `
        //         <h3 id="file-title"><strong>Upload project files: </strong></h3>
        //         <input type="file" id="file-input" style="display: none;" multiple />
        //         <button type="button" id="upload-button">ADD FILE</button>
        //         <ul id="file-list"></ul>
        //     `;

        //     const fileInput = document.getElementById("file-input");
        //     const uploadButton = document.getElementById("upload-button");
        //     //const fileList = document.getElementById("file-list");

        //     uploadButton.addEventListener("click", () => {
        //         fileInput.click();
        //     });

        //     fileInput.addEventListener("change", async () => {
        //         //const fileInput = document.getElementById("file-input");
        //         const files = fileInput.files;

        //         if(files.length === 0){
        //             alert("Please select a file to upload");
        //             return;
        //         }

        //         const formData = new FormData();
        //         for(let file of files) {
        //             formData.append("files", file); //append ea file
        //         }

        //         try{
        //             const token = localStorage.getItem("jwt");
        //             const response = await fetch("http://localhost:8081/api/files/upload", {
        //                 method:"POST",
        //                 headers: {
        //                     "Authorization": "Bearer " + token
        //                 },
        //                 body: formData
        //             });

        //             if(response.ok){
        //                 const fileList = await response.json();
        //                 displayUploadedFiles(fileList);
        //             }else{
        //                 const errorText = await response.text();
        //                 console.error("Upload failed:", errorText);
        //                 alert("Upload failed.");
        //             }
        //         }catch (error){
        //                 console.error("Error uploading file: ", error);
        //                 alert("Error uploading file.");
        //         }
                
        //     });
        // }

        // function displayUploadedFiles(fileList){
        //     const listContainer = document.getElementById("file-list");
        //     listContainer.innerHTML = "<h4>Uploaded Files:</h4>";

        //     const fragment = document.createDocumentFragment();

        //     fileList.forEach(file => {
        //         const p = document.createElement("p");
        //         const a = document.createElement("a");
        //         a.href = `/api/files/${file.id}`;
        //         a.target = "_blank";
        //         a.textContent = file.originName;
        //         p.appendChild(a);
        //         fragment.appendChild(p);
        //         //listContainer.innerHTML += `<p><a href="/api/files/${file.id}" target="_blank">${file.originName}</a></p>`;
        //     });
        //     listContainer.appendChild(fragment);
        // }
        // uploadFiles();