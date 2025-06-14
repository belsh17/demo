package com.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.entity.User;
import com.repository.UserRepository;

public class ManagerService {

    @Autowired
    private UserRepository userRepository;
    
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }
}
