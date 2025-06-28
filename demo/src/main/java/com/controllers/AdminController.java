package com.controllers;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dto.AdminUserDto;
import com.dto.RoleUpdateRequest;
import com.dto.UserDto;
import com.entity.Role;
import com.entity.User;
import com.repository.RoleRepository;
import com.repository.UserRepository;
import com.service.AdminService;

import io.micrometer.core.ipc.http.HttpSender.Response;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
// @CrossOrigin(origins = "*")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class AdminController {
    
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminService adminService;

    @PutMapping("/users/{id}/role")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateUserRole(@PathVariable Long id, @RequestBody RoleUpdateRequest request) {
        System.out.println("Received request to update user " + id + " to role: " + request.getNewRole());
        
        String newRoleName = request.getNewRole();

        if(newRoleName == null || newRoleName.isEmpty()){
            return ResponseEntity.badRequest().body("New role name is required");
        }

        Role newRole = roleRepository.findByRoleName(newRoleName)
            .orElseThrow(() -> new RuntimeException("Role not found: " + newRoleName));
        
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        
        user.setRole(newRole);
        userRepository.save(user);
        
        return ResponseEntity.ok("User role updated to " + newRoleName);
    }

    //use this mapping whenever you want list of users
    // @GetMapping("/users")
    // public List<User> getAllUsers() {
    //     return adminService.getAllUsers();
    // }


     @GetMapping("/users")
    public ResponseEntity<List<AdminUserDto>> getAllUsers() {

        List<User> users = userRepository.findAll();
        List<AdminUserDto> userDtos = users.stream()
            .map(AdminUserDto::new)
            .collect(Collectors.toList());

        return ResponseEntity.ok(userDtos);
    }
    
}
