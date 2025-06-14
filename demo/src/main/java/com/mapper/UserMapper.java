package com.mapper;

import org.springframework.stereotype.Component;

import com.dto.UserProfileDto;
import com.entity.User;

// UserMapper.java
@Component
public class UserMapper {
    public UserProfileDto toUserProfileDto(final User user) {
        return new UserProfileDto(user.getEmail(), user.getUsername());
    }
}
