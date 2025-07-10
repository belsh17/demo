package com.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dto.AuthenticationRequestDto;
import com.dto.AuthenticationResponseDto;
import com.dto.RegistrationRequestDto;
import com.dto.RegistrationResponseDto;
import com.mapper.UserRegistrationMapper;
import com.service.AuthenticationService;
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

    private final AuthenticationService authenticationService;

   
//COMMMNETED OUT TOP TO TEST BOTTOM WITH JWTS IF YOU USE TOP THEN CHECK MAPPER AND DTO
      @PostMapping("/register")
    public ResponseEntity<AuthenticationResponseDto> registerUser(
        @RequestBody final RegistrationRequestDto registrationDTO) {
        
            //maps user mapper to dto
            userRegistrationService.registerUser(
                userRegistrationMapper.toEntity(registrationDTO)
            );

                //ADDED WAS WORKING BEFORE - GENERATE JWT
            AuthenticationRequestDto authDto = new AuthenticationRequestDto(
                registrationDTO.username(),
                registrationDTO.password()
            );

            AuthenticationResponseDto authResponse = authenticationService.authenticate(authDto);
                //END OF ADDED
            return ResponseEntity.ok(authResponse);
        
    }
    
}









