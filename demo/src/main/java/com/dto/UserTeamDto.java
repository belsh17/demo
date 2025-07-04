package com.dto;

public class UserTeamDto {
    private Long id;
    private String fullName;
    private String teamRole;
    
    public UserTeamDto(Long id, String fullName, String teamRole) {
        this.id = id;
        this.fullName = fullName;
        this.teamRole = teamRole;
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

    public String getTeamRole() {
        return teamRole;
    }

    public void setTeamRole(String teamRole) {
        this.teamRole = teamRole;
    }

    
}
