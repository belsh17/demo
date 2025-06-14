package com.dto;

public class CreateProjectDto {
    private String projectName;
    private String projectDescription;
    private String projectDeadline;
    private String startDate;
    private Long clientId;
    private Long projectManagerId;
    public String getProjectName() {
        return projectName;
    }
    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
    public String getProjectDescription() {
        return projectDescription;
    }
    public void setProjectDescription(String projectDescription) {
        this.projectDescription = projectDescription;
    }
    public String getProjectDeadline() {
        return projectDeadline;
    }
    public void setProjectDeadline(String projectDeadline) {
        this.projectDeadline = projectDeadline;
    }
    public String getStartDate() {
        return startDate;
    }
    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }
    public Long getClientId() {
        return clientId;
    }
    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }
    public Long getProjectManagerId() {
        return projectManagerId;
    }
    public void setProjectManagerId(Long projectManagerId) {
        this.projectManagerId = projectManagerId;
    }

    
}
