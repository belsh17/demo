package com.dto;

import lombok.Getter;
import lombok.Setter;

//import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
public class RoleUpdateRequest {
    //@NotBlank(message = "New role is required")
    private String newRole;

    
}
