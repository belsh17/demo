package com.service;

import java.util.List;

import com.dto.UserDto;

//interface
public interface UserService{
    List<UserDto> getAllUsers();
}