package com.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dto.TaskDto;
import com.dto.TaskResponseDto;
import com.entity.Project;
import com.entity.Task;
import com.entity.TaskStatus;
import com.entity.User;
import com.repository.ProjectRepository;
import com.repository.TaskRepository;
import com.repository.UserRepository;
import com.service.TaskService;

import io.micrometer.core.ipc.http.HttpSender.Response;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;



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

    //code fo linking task to user
    @GetMapping("/tasks/user")
    public ResponseEntity<List<Task>> getTaskByLoggedInUser(
        @AuthenticationPrincipal Jwt jwt) {

        String username = jwt.getSubject();

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<Task> tasks = taskRepository.findTasksByProjectManager(user);
        return ResponseEntity.ok(tasks);
    }
    

    //get mapping for tasks to display in indiv. project screen
    // @GetMapping("/tasks")
    // public List<Task> getAllTasks(){
    //     return taskService.getAllTasks();
    // }

    //UPDATING THE ABOVE FOR DTO USE
    @GetMapping("/tasks")
    public ResponseEntity<List<TaskResponseDto>> getAllTasks(){
        List<Task> tasks= taskService.getAllTasks();
        List<TaskResponseDto> taskDtos = tasks.stream()
            .map(TaskResponseDto::new)
            .toList();

        return ResponseEntity.ok(taskDtos);
    }
    //END OF UPDATE

    // @GetMapping("/tasks")
    // public ResponseEntity<List<TaskDto>> getAllTasks() {
    //     List<Task> tasks = taskService.getAllTasks();
    //     List<TaskDto> taskDtos = tasks.stream()
    //         .map(task -> new TaskDto())
    //         .toList();

    //     return ResponseEntity.ok(taskDtos);

    // }
    

    // @GetMapping("/projects/{projectId}/tasks")
    // public List<Task>  getTasksByProject(
    //     @PathVariable Long projectId) {
    //     return taskService.getTasksByProjectId(projectId);
    // }

    //TESTING BELOW FOR DTO
    
    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<List<TaskResponseDto>>  getTasksByProject(
        @PathVariable Long projectId) {
            List<Task> tasks = taskService.getTasksByProjectId(projectId);
            List<TaskResponseDto> taskDtos = tasks.stream()
                .map(TaskResponseDto::new)
                .toList();
        return ResponseEntity.ok(taskDtos);
    }

    @PostMapping("/projects/{projectId}/tasks")
    // public ResponseEntity<Task> createTask(
     public ResponseEntity<TaskResponseDto> createTask(
        @PathVariable Long projectId, 
        @RequestBody TaskDto taskDto){
            Optional<Project> projectOpt = projectRepository.findById(projectId);
            Optional<User> userOpt = userRepository.findById(taskDto.getAssignedUserId());

            if(projectOpt.isEmpty() || userOpt.isEmpty()){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            Task task = new Task();
            task.setTaskName(taskDto.getTaskName());
            task.setTaskDescription(taskDto.getTaskDescription());
            task.setCreationDate(LocalDate.now());
            
            //task.setCreationDate(taskDto.getCreationDate());
            task.setDueDate(taskDto.getDueDate());
            task.setProject(projectOpt.get());
            task.setAssignedUser(userOpt.get());

             if(taskDto.getTaskStatus() == null){
                task.setTaskStatus(TaskStatus.INCOMPLETE);
            }else{
                task.setTaskStatus(TaskStatus.valueOf(taskDto.getTaskStatus().toUpperCase()));
            }

            Task savedTask = taskRepository.save(task);

            return new ResponseEntity<>(new TaskResponseDto(savedTask), HttpStatus.CREATED);
       
            //return new ResponseEntity<>(savedTask, HttpStatus.CREATED);
        }

        //endpoint for updating task status
        @PutMapping("/tasks/{taskId}")
        public ResponseEntity<Task> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestBody TaskDto taskDto,
            @RequestHeader("Authorization") String authHeader){

                Optional<Task> optionalTask = taskRepository.findById(taskId);

                if(optionalTask.isEmpty()){
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }

                Task task = optionalTask.get();

                //update only status if provided
                try{
                    if(taskDto.getTaskStatus() != null){
                    task.setTaskStatus(TaskStatus.valueOf(taskDto.getTaskStatus().toUpperCase()));
                    }
                }catch(IllegalArgumentException e){
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
                

                Task updatedTask = taskRepository.save(task);
                return new ResponseEntity<>(updatedTask, HttpStatus.OK);
        }
        
    
}
