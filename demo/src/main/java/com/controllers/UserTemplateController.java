package com.controllers;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AuthUtils;
import com.dto.SaveTemplateRequest;
import com.repository.UserTemplatesRepository;

import io.micrometer.core.ipc.http.HttpSender.Response;

import com.entity.Project;
import com.entity.User;
import com.entity.UserTemplates;
import com.repository.ProjectRepository;
import com.repository.UserRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("api/user-templates")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class UserTemplateController {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserTemplatesRepository userTemplatesRepository;

    @PostMapping("/save")
    public ResponseEntity<?> saveTemplate(@RequestBody SaveTemplateRequest request) {
        //getting username saved in jwt token
        String username = AuthUtils.getAuthenticatedUsername();
        if(username == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = projectRepository.findById(request.projectId)
            .orElseThrow(() -> new RuntimeException("Project not found"));

        UserTemplates template = new UserTemplates();
        template.setTemplateName(request.getTemplateName());
        template.setTemplateType(request.getTemplateType());
        template.setTemplateData(request.getTemplateData());
        template.setUser(user);
        template.setProject(project);
        template.setSaveDate(new Date());

        userTemplatesRepository.save(template);
        return ResponseEntity.ok("Template saved!");
    }
    
}
