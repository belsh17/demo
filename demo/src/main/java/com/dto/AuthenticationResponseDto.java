package com.dto;

public record AuthenticationResponseDto(
    String token,
    String dashboardType
) {
}
