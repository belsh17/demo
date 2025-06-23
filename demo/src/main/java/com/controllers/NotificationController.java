package com.controllers;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.entity.Project;
import com.entity.User;
import com.repository.ProjectRepository;
import com.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class NotificationController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user")
    public ResponseEntity<List<String>> getDeadlineNotificationsForLoggedInUser(
        @AuthenticationPrincipal Jwt jwt) {
            String username = jwt.getSubject();

            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            LocalDate now = LocalDate.now();
            LocalDate in24Hours = now.plusDays(1);
            LocalDate nextWeek = now.plusDays(7);

            //due in 1 day
            List<Project> dueTomorrow = projectRepository.findByProjectManagerAndDeadlineDateBetween(user, in24Hours, in24Hours);
            
            //due within next 7 days
            List<Project> dueThisWeek = projectRepository.findByProjectManagerAndDeadlineDateBetween(user, now.plusDays(2), nextWeek);
            
            List<String> notifications = new ArrayList<>();

            for(Project p : dueTomorrow){
                notifications.add("Project '" + p.getProjectName() + "' is due tomorrow (" + p.getDeadlineDate() + ")");
            }

            for(Project p : dueThisWeek){
                 notifications.add("Project '" + p.getProjectName() + "' is due this week on " + p.getDeadlineDate());
            }

            // List<String> notifications = projects.stream()
            //     .map(project -> {
            //         String projectName = project.getProjectName();
            //         //LocalDateTime deadline = project.getDeadlineDate();
            //         return "Project '" + projectName + "' is due by " + project.getDeadlineDate();
            //     })
            //     .collect(Collectors.toList());

        return ResponseEntity.ok(notifications);
    }
    
}
