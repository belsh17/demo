package com.mapper;

import org.springframework.stereotype.Component;

import com.dto.RegistrationRequestDto;
import com.dto.RegistrationResponseDto;
// import com.entity.ProjectManager;
import com.entity.User;

//user register mapper
@Component
public class UserRegistrationMapper {
    public User toEntity(RegistrationRequestDto registrationRequestDto){
        final var user = new User();
        //final var user = new ProjectManager();

        user.setEmail(registrationRequestDto.email());
        user.setUsername(registrationRequestDto.username());
        user.setPassword(registrationRequestDto.password());
        user.setFullName(registrationRequestDto.fullName());
        user.setDashboardType(registrationRequestDto.dashboardType());

        return user;
    }

    public RegistrationResponseDto toRegistrationResponseDto(
        final User user){
            return new RegistrationResponseDto(
                user.getEmail(), 
                user.getUsername(), 
                user.getDashboardType());
        }
}
