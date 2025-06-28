
// const userMockData = false;

// const urlParams = new URLSearchParams(window.location.search);
// const projectId = urlParams.get('id');

// async function getProjectDetails(){
//     if(userMockData){
//         const projects =  await fetch("/demo/src/main/resources/static/data/mockProjects.json")
//         .then(res => res.json());
//         const tasks = await fetch("/demo/src/main/resources/static/data/mockTasks.json")
//         .then(res => res.json());
//         const teams = await fetch("/demo/src/main/resources/static/data/mockTeams.json")
//         .then(res => res.json());
//         const users = await fetch("/demo/src/main/resources/static/data/mockUsers.json")
//         .then(res => res.json());
//         return { projects, tasks, teams, users };
//     }else{
//         const projects = await fetch(`http://localhost:8081/api/projects/${projectId}`)
//         .then(res => res.json());
//         const tasks = await fetch(`http://localhost:8081/api/projects/${projectId}/tasks`)
//         .then(res => res.json());
//         const teams = await fetch(`http://localhost:8081/api/projects/${projectId}/teams`)
//         .then(res => res.json());
//         const users = await fetch("http://localhost:8081/api/users")
//         .then(res => res.json());
//         return { projects, tasks, teams, users };
//         //return projects;
//     }
// }


// document.addEventListener("DOMContentLoaded", async () => {
//     const { projects, tasks, teams, users } = await getProjectDetails();
//     //const projects = await getProjectDetails();
//     //since you clicking "view" to see 1 project then the id will be saved in the url
//     //so you can search url for the proj. id
//     // const urlParams = new URLSearchParams(window.location.search);
//     // const projectId = urlParams.get("id");

//     const container = document.querySelector(".main-content > .projects-display");

//     if(!container){
//         console.error("Projects container not found");
//         return;
//     }

//     const project = projects.find(p => p.id == projectId);
//     if(!project){
//         container.innerHTML = "<p>Project not found.</p>";
//         return;
//     }

//     const header = document.getElementById("title-block");
//     if(header){
//         header.innerHTML = `<h1>${project.projectName}</h1>`;
//     }
    
//     //const projectDisplay = document.getElementById("projects-display");
//     const projectBlock =document.getElementById("project-block");
//     //MOCK DATA
//     // projectBlock.innerHTML = `
//     //         <h3 class="project-title1">Project Details: </h3>
//     //         <p class="project-description"><strong>Description: </strong>${project.projectDescription}</p>
//     //         <p class="project-details"><strong>Client: </strong> ${project.clientName}</p>
//     //         <p class="project-details"><strong>Project Manager: </strong> ${project.projectManagerName}</p>
//     //         <p class="project-details"><strong>Start Date: </strong> ${project.startDate}</p>
//     //         <p class="project-details"><strong>Deadline: </strong> ${project.projectDeadline}</p>
//     //     `;

//     //REAL DATA
//     projectBlock.innerHTML = `
//             <h3 class="project-title1">Project Details: </h3>
//             <p class="project-description"><strong>Description: </strong>${project.projDescription}</p>
//             <p class="project-details"><strong>Client: </strong> ${project.client}</p>
//             <p class="project-details"><strong>Project Manager: </strong> ${project.projectManager}</p>
//             <p class="project-details"><strong>Start Date: </strong> ${project.startDate}</p>
//             <p class="project-details"><strong>Deadline: </strong> ${project.deadlineDate}</p>
//         `;

//         const relatedTasks = tasks.filter(task => task.projectId === project.id);
//         const taskBlock = document.getElementById("task-block");
        
//         //function for getting user
//         function getUserNameById(id){
//             const user = users.find(u => u.id === id);
//             return user ? user.name : "Unassigned";
//         }
//         //end of teams

//         const filesBlock = document.getElementById("files-block");

//         function uploadFiles(){
//             filesBlock.innerHTML = `
//                 <h3 id="file-title"><strong>Upload project files: </strong></h3>
//                 <input type="file" id="file-input" style="display: none;" multiple />
//                 <button type="button" id="upload-button">ADD FILE</button>
//                 <ul id="file-list"></ul>
//             `;

//             const fileInput = document.getElementById("file-input");
//             const uploadButton = document.getElementById("upload-button");
//             //const fileList = document.getElementById("file-list");

//             uploadButton.addEventListener("click", () => {
//                 fileInput.click();
//             });

//             fileInput.addEventListener("change", async () => {
//                 //const fileInput = document.getElementById("file-input");
//                 const files = fileInput.files;

//                 if(files.length === 0){
//                     alert("Please select a file to upload");
//                     return;
//                 }

//                 const formData = new FormData();
//                 for(let file of files) {
//                     formData.append("files", file); //append ea file
//                 }

//                 try{
//                     // const response = await fetch("/api/files/upload", {
//                     const response = await fetch("http://localhost:8081/api/files/upload", {
//                         method:"POST",
//                         body: formData
//                     });

//                     if(response.ok){
//                         const fileList = await response.json();
//                         displayUploadedFiles(fileList);
//                     }else{
//                         alert("Upload failed.");
//                     }
//                 }catch (error){
//                         console.error("Error uploading file: ", error);
//                         alert("Error uploading file.");
//                 }
                

//                 //fileInput.click(); //opens file dialog
//             });

//             // fileInput.addEventListener("change", () => {
//             //     fileList.innerHTML = ""; //clears previous file list
//             //     const files = Array.from(fileInput.files);

//             //     files.forEach(file => {
//             //         const listItem = document.createElement("li");
//             //         listItem.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
//             //         fileList.appendChild(listItem);
//             //     });
//             // });
//         }

//         function displayUploadedFiles(fileList){
//             const listContainer = document.getElementById("file-list");
//             listContainer.innerHTML = "<h4>Uploaded Files:</h4>";
//             fileList.forEach(file => {
//                 listContainer.innerHTML += `<p><a href="/api/files/${file.id}" target="_blank">${file.originName}</a></p>`;
//             });
//         }
//         //uploadFiles();

//         //function to render updated tasks
//         function renderUpdatedTasks(){
//             //Reuse updated task rendering and event logic here
//              taskBlock.innerHTML = `
//                 <h3 class="task-title1">Tasks: </h3>
//                 <div class="task-list">
//                     ${
//                         relatedTasks.length > 0
//                         ? relatedTasks.map(task => ` 
//                             <div class="task-item">
//                                 <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${task.taskStatus === "Complete" ? "checked" : ""}>MARK COMPLETE</input>
//                                 <h4 class="dead-text1">${task.name || task.taskName}</h4>
//                                 <p class="dead-text1"><strong>Description: </strong> ${task.description || task.taskDescription}</p>
//                                 <p class="dead-text1"><strong>Due: </strong> ${task.dueDate}</p>
//                                 <p class="dead-text1"><strong>Status: </strong> <span id="status-${task.id}">${task.taskStatus}</span></p>
//                                 <p class="dead-text1"><strong>Assigned to: </strong>${getUserNameById(task.userAssigned)}</p>
//                             </div>
//                         `).join("")
//                     : "<p>No tasks for this project.</p>"
//                 }
//                 </div>
//                 <input type="text" id="new-task-name" placeholder="New task name">
//                 <input type="text" id="new-task-description" placeholder="Task description">
//                 <input type="date" id="new-task-due-date">
//                 <select id="user-assigned-dropdown">
//                     ${users.map(user => `<option value="${user.id}">${user.name}</option>`).join("")}
//                 </select>
//                 <button id="add-task-btn">Add Task</button>
//                 `;

//                 attachTaskEventListener();
//             }
//         function attachTaskEventListener(){
//         document.querySelectorAll(".task-checkbox").forEach(checkbox => {
//             checkbox.addEventListener("change", (e) => {
//                 const taskId = parseInt(e.target.dataset.taskId);
//                 const task = relatedTasks.find(t => t.id === taskId);
//                 if(task){
//                     task.taskStatus = e.target.checked ? "Complete" : "Incomplete";
//                     document.getElementById(`status-${task.id}`).innerText = task.taskStatus;
//                     updateProgressBar(relatedTasks);
//                 }
//             });
//         }); 

//         //add new task if none created already
//         document.getElementById("add-task-btn").addEventListener("click", () => {
//             const nameInput = document.getElementById("new-task-name");
//             const newTaskName = nameInput.value.trim();
//             const descriptionInput = document.getElementById("new-task-description");
//             const newTaskDescription = descriptionInput.value.trim();
//             const dueDateInput = document.getElementById("new-task-due-date");
//             const newTaskDueDate = dueDateInput.value;
//             const userSelect = document.getElementById("user-assigned-dropdown");
//             const assignedUserId = parseInt(userSelect.value);

//             if(!newTaskName) return;

//             const newTask = {
//                 id: Date.now(),
//                 name: newTaskName,
//                 description: newTaskDescription,
//                 creationDate: new Date().toISOString().split("T")[0],
//                 taskStatus: "Incomplete",
//                 dueDate: newTaskDueDate,
//                 projectId: project.id,
//                 userAssigned: assignedUserId //fetching from baxckend this is mock
                
//             };
//             relatedTasks.push(newTask);
//             nameInput.value = "";
//             descriptionInput.value = "";
//             dueDateInput.value = "";

//             //Re-render the whole task block
//             //taskBlock.innerHTML = "";
//             renderUpdatedTasks();
//             updateProgressBar(relatedTasks);
//         });
//    }

//    function updateProgressBar(taskList){
//             const progressContainer = document.getElementById("progress-bar-container");
//             const total = taskList.length;
//             const completed = taskList.filter(t => t.taskStatus === "Complete").length;
//             const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

//             progressContainer.innerHTML = `
//             <h3 id="progress-title">Project Progress: ${percent}%</h3>
//             <div style="width:100%; background:#ddd; border-radius: 10px; height: 20px;">
//                 <div style="width:${percent}%; background: green; height: 100%; border-radius: 10px;"></div>
//             </div>
//             `;
//         }
//         renderUpdatedTasks();
//         updateProgressBar(relatedTasks);

//          const relatedTeams = teams.filter(team => team.projectId === project.id);
//         const teamBlock = document.getElementById("team-block");
//         teamBlock.innerHTML = `
//             ${relatedTeams.length > 0
//                 ? relatedTeams.map(team => `
//                     <h3><strong>Team Name: </strong>${team.teamName}</h3>
//                 `).join("") : "<p> No team linked for this project</p>"
//             }
//         `;

//         uploadFiles();
//     });



        


// //<h3 class="project-title">${project.projectName}</h3>