package com.service;

import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.entity.Role;
import com.entity.User;
import com.repository.RoleRepository;
import com.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

// UserService.java
@Service
@RequiredArgsConstructor
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    // public User createUser(String username, String email, Role role){
    //     return userRepository.findByUsername(username)
    //     .orElseGet(() -> {
    //         User newUser = new User();
    //         newUser.setUsername(username);
    //         newUser.setEmail(email);
    //         newUser.setRole(null);
    //         return newUser;
    //     });
    // }

    public User getUserByUsername(final String username) {
        return userRepository.findByUsername(username)
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.GONE, 
              "The user account has been deleted or inactivated"));
    }

    public List<User> getUserByRole(String roleName){
        return userRepository.findByRoleRoleName(roleName);
    }

    @Transactional
    public void assignRoleToUser(String username, String roleName){
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found"));
        
        Role role = roleRepository.findByRoleName(roleName)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Role not found"));

        user.setRole(role);
        userRepository.save(user);
    }

    // public void updateFullName(String username, String fullname){
    //     User user = getUserByUsername(username);
    //     user.setProjectManagerName(username);
    //     userRepository.save(user);
    // }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }
}
