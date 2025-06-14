package com.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dto.TaskDto;
import com.entity.Project;
import com.entity.Task;
import com.entity.TaskStatus;
import com.entity.User;
import com.repository.ProjectRepository;
import com.repository.TaskRepository;
import com.repository.UserRepository;
import com.service.TaskService;
import org.springframework.web.bind.annotation.RequestParam;


//mapping for tasks
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"}) 
public class TasksController {
    
    @Autowired
    private TaskService taskService;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    //uploading new task
    // @PostMapping("/tasks")
    // public Task createTask(@PathVariable Long projectId, @RequestBody Task task){
    //     Project project = new Project();
    //     project.setId(projectId);
    //     task.setProject(project);

    //     return taskService.saveTask(task);
    // }

    //get mapping for tasks to display in indiv. project screen
    @GetMapping("/tasks")
    public List<Task> getAllTasks(){
        return taskService.getAllTasks();
    }

    @GetMapping("/projects/{projectId}/tasks")
    public List<Task>  getTasksByProject(
        @PathVariable Long projectId) {
        return taskService.getTasksByProjectId(projectId);
    }

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<Task> createTask(
        @PathVariable Long projectId, 
        @RequestBody TaskDto taskDto){
            Optional<Project> projectOpt = projectRepository.findById(projectId);
            Optional<User> userOpt = userRepository.findById(taskDto.getAssignedUserId());

            if(projectOpt.isEmpty() || userOpt.isEmpty()){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            // if(taskDto.getTaskStatus() == null){
            //     taskDto.setTaskStatus("Incomplete");
            // }
            
            Task task = new Task();
            task.setTaskName(taskDto.getTaskName());
            task.setTaskDescription(taskDto.getTaskDescription());
            task.setCreationDate(LocalDate.now());
            // try{
            //     task.setTaskStatus(TaskStatus.valueOf(taskDto.getTaskStatus().toUpperCase()));
            // }catch(IllegalArgumentException e) {
            //     return ResponseEntity.badRequest().body(null);
            // }

            // if(taskDto.getCreationDate() == null){
            //     task.setCreationDate(LocalDate.now());
            // }else{
            //     task.setCreationDate(taskDto.getCreationDate());
            // }
            
            //task.setCreationDate(taskDto.getCreationDate());
            task.setDueDate(taskDto.getDueDate());
            task.setProject(projectOpt.get());
            task.setAssignedUser(userOpt.get());

            Task savedTask = taskRepository.save(task);

            return new ResponseEntity<>(savedTask, HttpStatus.CREATED);
        }
    
}
