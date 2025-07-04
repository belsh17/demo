package com.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.AuthUtils;
import com.dto.CreateProjectDto;
import com.dto.ProjectDeadlineDTO;
import com.dto.ProjectDto;
import com.dto.SPointDTO;
import com.entity.Client;
import com.entity.Project;
import com.entity.User;
import com.repository.ClientRepository;
import com.repository.ProjectRepository;
import com.repository.UserRepository;
import com.service.ProjectService;

import io.micrometer.core.ipc.http.HttpSender.Response;

import com.service.AdminService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.bind.annotation.RequestParam;




@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"}) //Allows CORS if using live server frontend
public class ProjectController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private AdminService userService;
    

    @PostMapping
    //COMMMENTED OUT BELOW FOR ADDED
    // public ResponseEntity<Project> createProject(
    //ADDED 
    public ResponseEntity<ProjectDto> createProject(
        @RequestBody CreateProjectDto dto,
        @AuthenticationPrincipal Jwt jwt
    ) {
        Project project = new Project();
        project.setProjectName(dto.getProjectName());
        project.setProjDescription(dto.getProjectDescription());
        project.setCreationDate(LocalDate.now());
        project.setStartDate(LocalDate.parse(dto.getStartDate()));
        project.setDeadlineDate(LocalDate.parse(dto.getProjectDeadline()));

        //Set related entities client and manager 
        Client client = clientRepository.findById(dto.getClientId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found"));
        
        User manager = userRepository.findById(dto.getProjectManagerId()) 
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Manager not found"));  
        
        //ADDED THIS TO SET CREATED BY
        String username = jwt.getSubject();
        User creator = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        //END OF CREATED BY

        project.setClient(client);
        project.setProjectManager(manager);
        //ADDED THIS TO SET CREATED BY
        project.setCreatedBy(creator);
        //END OF ADDED

        Project saved = projectRepository.save(project);

        //ADDED FOR CREATED BY
        ProjectDto response = new ProjectDto();
        response.setId(saved.getId());
        response.setProjectName(saved.getProjectName());
        response.setProjDescription(saved.getProjDescription());
        response.setCreationDate(saved.getCreationDate());
        response.setDeadlineDate(saved.getDeadlineDate());
        response.setStartDate(saved.getStartDate());
        response.setClientName(client.getClientName());
        response.setClientAccount(client.getAccountNumber());
        response.setManagerName(manager.getFullName());
        response.setCreatedBy(creator.getId());
        //END OF CREATED BY
        
        //commmenting out below for added
        //return ResponseEntity.ok(saved);
        //ADDED BELOW
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // @GetMapping("/{id}")
    // public ResponseEntity<Project> getProjectId(@PathVariable Long id) {
    //     Project project = projectRepository.findById(id)
    //         .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    //         return ResponseEntity.ok(project);
    // }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProjectId(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        
            ProjectDto dto = new ProjectDto();
            dto.setProjectName(project.getProjectName());
            dto.setProjDescription(project.getProjDescription());
            dto.setCreationDate(project.getCreationDate());
            dto.setDeadlineDate(project.getDeadlineDate());
            dto.setStartDate(project.getStartDate());
            dto.setClientName(project.getClient() != null ? project.getClient().getClientName() : null);
            dto.setClientAccount(project.getClient() != null ? project.getClient().getAccountNumber() : null);
            dto.setManagerName(project.getProjectManager() != null ? project.getProjectManager().getFullName() : null);
            dto.setCreatedBy(project.getCreatedBy() != null ? project.getCreatedBy().getId() : null);
            return ResponseEntity.ok(dto);
    }

    //mapping for displaying dealdines on dahsboard
    @GetMapping("/deadlines")
    public List<ProjectDeadlineDTO> getProjectDeadlines() {
        List<Project> projects = projectRepository.findAll();
        return projects.stream()
        .map(p -> new ProjectDeadlineDTO(p.getId(), p.getProjectName(), p.getDeadlineDate()))
        .collect(Collectors.toList());
    }

    //mapping for displaying dealdines on dahsboard
    @GetMapping("/deadlines/user")
    public List<ProjectDeadlineDTO> getProjectUserDeadlines(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<Project> projects = projectRepository.findByProjectManagerOrCreatedBy(user, user);
        return projects.stream()
        .map(p -> new ProjectDeadlineDTO(p.getId(), p.getProjectName(), p.getDeadlineDate()))
        .collect(Collectors.toList());
    }

    //mapping for s ciurve graph on dashboard
    @GetMapping("/{projectId}/s-curve")
    public ResponseEntity<List<SPointDTO>> getSCurve(@PathVariable Long projectId) {
        Project project =  projectRepository.findById(projectId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
       
        List<SPointDTO> sCurveData = projectService.generateSCurveData(project);
        return ResponseEntity.ok(sCurveData);
    }
    
    // @GetMapping("/user")
    // public ResponseEntity<List<Project>> getProjectsForLoggedInUser(@AuthenticationPrincipal Jwt jwt) {
    //     String username = jwt.getSubject();

    //     User user = userRepository.findByUsername(username)
    //         .orElseThrow(() -> new RuntimeException("User not found"));

    //     List<Project> projects = projectRepository.findByProjectManager(user);
    //     return ResponseEntity.ok(projects);
    // }

    //WAS WORKING
     @GetMapping("/user")
    public ResponseEntity<List<Project>> getProjectsForLoggedInUser(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<Project> projects = projectRepository.findByProjectManagerOrCreatedBy(user, user);
        return ResponseEntity.ok(projects);
    }


     @GetMapping("/user/display")
    public ResponseEntity<List<ProjectDto>> getProjectDisplayForLoggedInUser(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<Project> projects = projectRepository.findByProjectManagerOrCreatedBy(user, user);
        
        List<ProjectDto> dtos = projects.stream().map(project -> {
            ProjectDto dto = new ProjectDto();
            dto.setId(project.getId());
            dto.setProjectName(project.getProjectName());
            dto.setProjDescription(project.getProjDescription());
            dto.setCreationDate(project.getCreationDate());
            dto.setDeadlineDate(project.getDeadlineDate());
            dto.setStartDate(project.getStartDate());
            dto.setClientName(project.getClient() != null ? project.getClient().getClientName() : null);
            dto.setClientAccount(project.getClient() != null ? project.getClient().getAccountNumber() : null);
            dto.setManagerName(project.getProjectManager() != null ? project.getProjectManager().getFullName() : null);
            dto.setCreatedBy(project.getCreatedBy() != null ? project.getCreatedBy().getId() : null);
            //ADDED FOR PROJ STATUS AUTO
            dto.setComplete(project.getComplete());
            //END OF ADDED
            return dto;
        }).collect(Collectors.toList());
            
        return ResponseEntity.ok(dtos);
    }
    
    
}
