package com.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.entity.Role;
import com.entity.User;
import com.repository.RoleRepository;
import com.repository.UserRepository;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import com.dto.RegistrationRequestDto;;

//user registration service
@Service
@RequiredArgsConstructor
public class UserRegistrationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    @Transactional
    //public User registerUser(RegistrationRequestDto request){
    public User registerUser(User user){
        // if(userRepository.existsByUsername(request.getUsername()) || 
        //     userRepository.existsByEmail(request.getEmail()) ){
        //checks if user exists by username or email
        if(userRepository.existsByUsername(user.getUsername()) || 
            userRepository.existsByEmail(user.getEmail()) ){

                //if doesnt exist throws a error "username or email already exists"
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Username or Email already exists");
        }

        //sets users fullname if does exist
        user.setFullName(user.getFullName());

        // User user = new User();
        // user.setUsername(request.getUsername());
        // user.setEmail(request.getEmail());
        //sets users password 
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        //determine role based on if user exists
        boolean isFirstUser = userRepository.count() == 0;
        String roleName = isFirstUser ? "ADMIN" : "USER";

        //gets role using role repo
        Role role = roleRepository.findByRoleName(roleName)
            .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
        user.setRole(role);
        //end of role code

        return userRepository.save(user);
    }

}
