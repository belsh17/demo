package com.dto;

public record AuthenticationRequestDto(
    String username,
    String password
) {
}
