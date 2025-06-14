package com.dto;

import java.sql.Date;
import java.time.LocalDate;

//created because when sending task to backend it expects a project object
public class TaskDto {
    private String taskName;
    private String taskDescription;
    //private String taskStatus;
    //private LocalDate creationDate;
    private LocalDate dueDate;
    //private Long projectId;
    private Long assignedUserId;
    
    public String getTaskName() {
        return taskName;
    }
    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }
    public String getTaskDescription() {
        return taskDescription;
    }
    public void setTaskDescription(String taskDescription) {
        this.taskDescription = taskDescription;
    }
    // public String getTaskStatus() {
    //     return taskStatus;
    // }
    // public void setTaskStatus(String taskStatus) {
    //     this.taskStatus = taskStatus;
    // }
    // public LocalDate getCreationDate() {
    //     return creationDate;
    // }

    // public void setCreationDate(LocalDate creationDate) {
    //     this.creationDate = creationDate;
    // }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    // public Long getProjectId() {
    //     return projectId;
    // }
    // public void setProjectId(Long projectId) {
    //     this.projectId = projectId;
    // }
    public Long getAssignedUserId() {
        return assignedUserId;
    }
    public void setAssignedUserId(Long assignedUserId) {
        this.assignedUserId = assignedUserId;
    }

    
}
