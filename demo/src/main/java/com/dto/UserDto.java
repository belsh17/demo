package com.dto;

public class UserDto {
    
    private Long id;
    private String fullName;

    
    public UserDto(Long id, String fullName) {
        this.id = id;
        this.fullName = fullName;
    }
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    
}
