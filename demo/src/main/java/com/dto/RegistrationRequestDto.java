package com.dto;

//Registration request DTO
public record RegistrationRequestDto(
    String username,
    String email,
    String password,
    String fullName,
    String dashboardType
){    
}
