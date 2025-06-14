package com.dto;

import java.util.List;

public class CreateTeamDTO {
    private String teamName;
    private Long projectId;
    //handle multiple users and roles
    private List<TeamMemberDTO> members;
    
    public String getTeamName() {
        return teamName;
    }
    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }
    public Long getProjectId() {
        return projectId;
    }
    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
    
    public List<TeamMemberDTO> getMembers() {
        return members;
    }

    public void setMembers(List<TeamMemberDTO> members) {
        this.members = members;
    }

    
}
