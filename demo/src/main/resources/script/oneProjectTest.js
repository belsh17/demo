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
    

     const token = localStorage.getItem("jwt");
     if(!token){
                alert("No token found. Please log in again");
                return [];
            }
    try {
        const res = await fetch(`http://localhost:8081/api/projects/${projectId}/tasks`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
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
        console.log("projectId being passed to fetch:", projectId);
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

    //function to fetch saved templates for specified project
    async function getSavedTemplates(projectId){
        const token = localStorage.getItem("jwt");
        if(!token){
            alert("No token found. PLease log in again");
            return [];
        }

        try{
            const res = await fetch(`http://localhost:8081/api/user-templates/my-templates?projectId=${projectId}`,{
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
                    throw new Error("Failed to fetch project templates.");
                }
            }

            const data = await res.json();
            return data;
        }catch(error){
            console.log("Error fetching project templates: " + error);
            return [];
        }
            
    }

let relatedTasks = [];

document.addEventListener("DOMContentLoaded", async () => {

    //ADDED CODE FOR BACK BUTTON
        const backBtn = document.querySelector(".back-button");
        if(backBtn){
            backBtn.addEventListener("click", function(){
                window.history.back();
            });
        }
        //END OF ADDED

    //CODE FOR HIDING THE ADMIN USERS FROM SIDE TAB
        const adminTab = document.getElementById("admin-tab");
        const token = localStorage.getItem("jwt");
        if(!token){
            adminTab.style.display = "none";
            return;
        }

        const decoded = parseJwt(token);
        const roles = decoded?.roles || [];
        console.log("Decoded roles:", roles);

        const isAdmin = roles === "ADMIN" || roles === "ROLE_ADMIN";

        if(!isAdmin){
            adminTab.style.display = "none";
        }
        //END OF ADMIN USERS
    
    //TESTING DASH LINK
    const dashboardType = localStorage.getItem("dashboardType");
    const dashboardLink = document.querySelector('.tab-list a[href*="defaultDashboard.html"]');

    if(dashboardLink){
        dashboardLink.setAttribute("href",
            dashboardType === "customizable"
            ? "customizableDashboard.html"
            : "defaultDashboard.html");
    }

    const links = document.querySelectorAll(".tab-list a");
    const currentURL = window.location.href;
    links.forEach(link => {
        if(currentURL.includes(link.href)){
            link.classList.add("active");
        }
    });
    //END OF DASH SET UP
    //can only use await with async
    const project = await getProjectDetails();
    const container = document.querySelector(".main-content > .projects-display");

    if(!container){
        console.error("Projects container not found");
        return;
    }


    if(!project){
        container.innerHTML = "<p>Project not found.</p>";
        return;
    }

    const header = document.getElementById("title-block");
    if(header){
        header.innerHTML = `<h1>${project.projectName}</h1>`;
    }
    
    const projectDisplay = document.querySelector(".projects-display");
    const projectBlock =document.getElementById("project-block");

    const projectName = project?.projectName || "Unnamed Project";
    const projDescription = project?.projDescription || "No description";
    const clientName = project?.clientName || "No client";
    const managerName = project?.managerName || "No manager";
    
    // const clientName = project?.client?.name || "No client";
    // const managerName = project?.projectManager?.name || "No manager";
    const startDate = project?.startDate || "N/A";
    const deadlineDate = project?.deadlineDate || "N/A";
    //const projectId = project?.id || "#";

    projectBlock.innerHTML = `
                <h3 class="project-title">${projectName}</h3>
                <p class="project-description"><strong>Description:</strong>${projDescription}</p>
                <p class="project-details"><strong>Client:</strong> ${clientName}</p>
                <p class="project-details"><strong>Project Manager:</strong> ${managerName}</p>
                <p class="project-details"><strong>Start Date:</strong> ${startDate}</p>
                <p class="project-details"><strong>Deadline:</strong> ${deadlineDate}</p>
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

    relatedTasks = task.filter(task => Number(task.projectId) === Number(projectId));
   
    //relatedTasks = task.filter(task => task.project?.id === project.id);
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
                                <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${task.taskStatus?.toUpperCase() === "COMPLETE" ? "checked" : ""}>MARK COMPLETE</input>
                                <h4 class="dead-text1">${task.name || task.taskName}</h4>
                                <p class="dead-text1"><strong>Description: </strong> ${task.description || task.taskDescription}</p>
                                <p class="dead-text1"><strong>Due: </strong> ${task.dueDate}</p>
                                <p class="dead-text1"><strong>Status: </strong> <span id="status-${task.id}">${task.taskStatus || "INCOMPLETE"}</span></p>
            
                                <p class="dead-text1"><strong>Assigned to: </strong>${getUserNameById(task.assignedUserId)}</p>
                            </div>
                        `).join("")
                    : "<p>No tasks for this project.</p>"
                }
                </div>
                <input type="text" id="new-task-name" placeholder="New task name">
                <input type="text" id="new-task-description" placeholder="Task description">
                <label for="new-task-due-date">Due Date: </label>
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
        async function attachTaskEventListener(){
        document.querySelectorAll(".task-checkbox").forEach(checkbox => {
            checkbox.addEventListener("change", async (e) => {
                const taskId = parseInt(e.target.dataset.taskId);
                const task = relatedTasks.find(t => t.id === taskId);
                if(task){
                    //THIS IS STATIC NOT DYNAMIC
                    // task.taskStatus = e.target.checked ? "Complete" : "Incomplete";
                    // document.getElementById(`status-${task.id}`).innerText = task.taskStatus;
                    // updateProgressBar(relatedTasks);
                    //END OF STATIC

                    //TESTING DYNAMIC

                    //END OF DYNAMIC

                    const updatedStatus = e.target.checked ? "COMPLETE" : "INCOMPLETE";

                    //update UI immediately
                    task.taskStatus = updatedStatus;
                    document.getElementById(`status-${task.id}`).innerText = updatedStatus;
                    updateProgressBar(relatedTasks);

                    //persist to backend 
                    const token = localStorage.getItem("jwt");
                    try{
                        console.log("Sending updated status:", updatedStatus);
                        const res = await fetch(`http://localhost:8081/api/tasks/${task.id}`,{
                            method: "PUT",
                            headers: {
                                "Authorization" : "Bearer " + token,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                taskStatus: updatedStatus
                            })
                        });

                        if(!res.ok){
                            throw new Error("Failed to update task status");
                        }

                        console.log("Task status updated in backend:", updatedStatus);
                    }catch(err){
                        console.error("Error updating task status:", err);
                        alert("Failed to save task status. Please try again.");
                    }
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
                taskStatus: "INCOMPLETE",
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
            console.log("Saved task from backend: ", savedTask);
            // savedTask.projectId = project.id;
            // savedTask.assignedUserId = savedTask.assignedUserId?.id;
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
   updateProgressBar(relatedTasks);
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

            //const text = await response.text();

         if(response.ok){
            const uploadedFiles = await response.json();
            console.log("Files uploaded successfully: ", uploadedFiles);

            //refresh the file to show all project files
            const updatedFiles = await getProjectFiles(projectId);
            //displayUploadedFiles(updatedFiles);
            displayProjectFiles(updatedFiles);

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

    //start code for templates div
    console.log("Fetching templates for project ID:", projectId);
    const currentUsername = decoded.sub;
    const templates = await getSavedTemplates(projectId);
    const templatesBlock = document.getElementById("templates-block");

        templatesBlock.innerHTML = `
            <h3 id="templates-title"><strong>Project templates: </strong></h3>
            <ul id="template-list"></ul>
        `;

        const list = document.getElementById("template-list");

        if(templates.length === 0){
            list.innerHTML = "<li>No saved templates for this project.</li>";
            return;
        }

        templates.forEach(template => {
            const li = document.createElement("li");
            li.style.marginBottom = "12px";
            li.innerHTML = `
                <strong>${template.templateName}</strong> (${template.templateType})<br/>
                ${template.username === currentUsername
                   ? `<button class="edit-btn" onclick="editTemplate(${template.id})">Edit</button>`
                   : `<span style="color:gray;">(View only)</span>`
                }
            `;
            list.appendChild(li);
            //<button class="edit-btn" onclick="editTemplate(${template.id})">Edit</button>
        
        });
        //display existing files immediatly
        //getSavedTemplates(templates);
    //end code for templates div
});

//additional helper functions
function editTemplate(templateId){
    window.location.href = `edit-template.html?templateId=${templateId}`;
    console.log("Edit template with ID:", templateId);
}
function updateProgressBar(taskList){
            const progressContainer = document.getElementById("progress-bar-container");
            const total = taskList.length;
            const completed = taskList.filter(t => t.taskStatus === "COMPLETE").length;
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
            fileLink.textContent = file.filename || file.originalName || file.fileName | "Unknown file";
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
     
//helper for logout function
  function parseJwt(token){
    try{
        const base64Url = token.split('.')[1]; //gets payload of jwt
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e){
        console.error("Ivalid JWT", e);
        return null;
    }
  }