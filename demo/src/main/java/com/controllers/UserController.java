package com.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dto.UserDto;
import com.service.UserService;

import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"}) 
public class UserController {

        @Autowired
        private UserService userService;

        //only gets user if it has these defined roles
        @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER', 'USER')")
        @GetMapping
        //using dto to define user structure in token and dashboard type form
        public ResponseEntity<List<UserDto>> getAllUsers() {
            List<UserDto> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        }
        

}
