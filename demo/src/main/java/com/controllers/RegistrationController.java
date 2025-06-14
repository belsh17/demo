package com.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dto.RegistrationRequestDto;
import com.dto.RegistrationResponseDto;
import com.mapper.UserRegistrationMapper;
import com.service.UserRegistrationService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class RegistrationController {
    
    private final UserRegistrationService userRegistrationService;

    private final UserRegistrationMapper userRegistrationMapper;

    //creates mapping between HTTP POST requests and handler methods
    @PostMapping("/register")
    public ResponseEntity<RegistrationResponseDto> registerUser(
        @RequestBody final RegistrationRequestDto registrationDTO) {
        
            final var registeredUser = userRegistrationService
                .registerUser(userRegistrationMapper.toEntity(registrationDTO));

            return ResponseEntity.ok(
                userRegistrationMapper.toRegistrationResponseDto(registeredUser)
            );
        
    }
    
}









