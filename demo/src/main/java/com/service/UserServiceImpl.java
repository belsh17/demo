package com.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dto.UserDto;
import com.entity.User;
import com.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService{
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<UserDto> getAllUsers(){
        List<User> users = userRepository.findAll();

        return users.stream()
            .map(user -> new UserDto(user.getId(), user.getFullName()))
            .collect(Collectors.toList());
    }
}
