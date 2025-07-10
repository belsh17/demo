package com.mapper;

import org.springframework.stereotype.Component;

import com.dto.RegistrationRequestDto;
import com.dto.RegistrationResponseDto;
// import com.entity.ProjectManager;
import com.entity.User;

//user register mapper - convert data between dto sent from frontend and user entity
@Component
public class UserRegistrationMapper {
    public User toEntity(RegistrationRequestDto registrationRequestDto){
        final var user = new User();
        //NEED MAPPER SO DONT EXPOSE ENTITY CLASS LIKE USER DIRECTLY TO FRONTEND (security - sensitive fields, flexiability - only specified fields, separation of concerns)
        //final var user = new ProjectManager();

        //takes request dto front frontened and builds a user entity to save to db
        user.setEmail(registrationRequestDto.email());
        user.setUsername(registrationRequestDto.username());
        user.setPassword(registrationRequestDto.password());
        user.setFullName(registrationRequestDto.fullName());
        user.setDashboardType(registrationRequestDto.dashboardType());

        return user;
    }

   
}
