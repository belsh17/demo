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
    public ResponseEntity<Project> createProject(
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
        
        project.setClient(client);
        project.setProjectManager(manager);

        Project saved = projectRepository.save(project);
        
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectId(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
            return ResponseEntity.ok(project);
    }

    //mapping for displaying dealdines on dahsboard
    @GetMapping("/deadlines")
    public List<ProjectDeadlineDTO> getProjectDeadlines() {
        List<Project> projects = projectRepository.findAll();
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
    
    @GetMapping("/user")
    public ResponseEntity<List<Project>> getProjectsForLoggedINUser() {
        String username = AuthUtils.getAuthenticatedUsername();
        if(username == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<Project> projects = projectRepository.findByUser(user);
        return ResponseEntity.ok(projects);
    }
    
    
    

    // @GetMapping("/api/users/project-managers")
    // public List<User> getProjectManagers() {
    //     return userService.getUserByRole("PROJECT_MANAGER");
    // }
    
    
    
}
