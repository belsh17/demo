package com.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dto.UserDto;
import com.entity.Role;
import com.entity.User;
import com.repository.RoleRepository;
import com.repository.UserRepository;
import com.service.AdminService;

import org.springframework.web.bind.annotation.GetMapping;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users") //base url for all client API endpoints
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"}) //Allows CORS if using live server frontend
public class ManagerController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/project-managers")
    //public ResponseEntity<List<UserDto>> getProjectManagers() {
    public ResponseEntity<List<User>> getProjectManagers() {
     
        // Role projeManagerRole = roleRepository.findByRoleName("PROJECT_MANAGER")
        //     .orElseThrow(() -> new RuntimeException("Role not found"));

        // List<UserDto> managers = userRepository.findByRoleRoleName("PROJECT_MANAGER")
        //     .stream()
        //     .map(user -> new UserDto(user.getId(), user.getFullName()))
        //     .collect(Collectors.toList());
        List<User> managers = userRepository.findByRoleRoleName("PROJECT_MANAGER");
        return ResponseEntity.ok(managers);
        //return ResponseEntity.ok(adminService.getUserByRole("PROJECT_MANAGER"));
    }
    
}
