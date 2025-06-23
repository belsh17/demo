package com.controllers;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




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
    public ResponseEntity<?> saveTemplate(
        @RequestBody SaveTemplateRequest request,
        @AuthenticationPrincipal Jwt jwt) {
        //getting username saved in jwt token
        String username = jwt.getSubject();
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

    //gets the saved template
    @GetMapping("/my-templates")
    public ResponseEntity<?> getMyTemplates(
        @AuthenticationPrincipal Jwt jwt,
        @RequestParam(required = false) Long projectId) {

        String username = jwt.getSubject();

        if(username == null){
            return  ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        //List<UserTemplates> templates = userTemplatesRepository.findByUser(user);

        List<UserTemplates> templates;
        //code for project template specific 
        if(projectId != null){
            Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
                templates = userTemplatesRepository.findByUserAndProject(user, project);
        }else{
            templates = userTemplatesRepository.findByUser(user);
        }

        return ResponseEntity.ok(templates);
    }

    @PutMapping("/update/{templateId}")
    public ResponseEntity<?> updateTemplate(
        @PathVariable Long templateId, 
        @RequestBody SaveTemplateRequest updatedData,
        @AuthenticationPrincipal Jwt jwt
    ) {

        String username = jwt.getSubject();
        if(username == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        UserTemplates existing = userTemplatesRepository.findById(templateId)
            .orElseThrow(() -> new RuntimeException("Template not found"));
        
        //check if template belongs to logged in user
        if(!existing.getUser().getId().equals(user.getId())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        existing.setTemplateName(updatedData.getTemplateName());
        existing.setTemplateType(updatedData.getTemplateType());
        existing.setTemplateData(updatedData.getTemplateData());
        existing.setSaveDate(new Date());

        userTemplatesRepository.save(existing);

        return ResponseEntity.ok("Template updated successfully");
        
    }

    @GetMapping("/{templateId}")
    public ResponseEntity<?> getTemplateById(
        @PathVariable Long templateId,
        @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        if(username == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserTemplates template = userTemplatesRepository.findById(templateId)
            .orElseThrow(() -> new RuntimeException("Template not found"));

        if(!template.getUser().getId().equals(user.getId())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        return ResponseEntity.ok(template);
    }
    
    
    
}
