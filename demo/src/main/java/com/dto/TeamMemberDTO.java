package com.dto;

public class TeamMemberDTO {
    private Long userId;
    private String teamRole;
    
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public String getTeamRole() {
        return teamRole;
    }
    public void setTeamRole(String teamRole) {
        this.teamRole = teamRole;
    }

    
}
