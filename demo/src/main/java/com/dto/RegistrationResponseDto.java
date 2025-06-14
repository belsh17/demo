package com.dto;

//Registration response dto
public record RegistrationResponseDto(
    String username,
    String email,
    //String fullName,
    String dashboardType
){
}
