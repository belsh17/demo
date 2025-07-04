package com.dto;

import java.sql.Date;
import java.time.LocalDate;

import com.entity.Task;

//created because when sending task to backend it expects a project object
public class TaskDto {
    private String taskName;
    private String taskDescription;
    private LocalDate dueDate;
    private Long assignedUserId;
    private String taskStatus;
    private Long projectId;


    public TaskDto(){
        
    }
    
    public TaskDto(String taskName, String taskDescription, LocalDate dueDate, Long assignedUserId, String taskStatus) {
        this.taskName = taskName;
        this.taskDescription = taskDescription;
        this.dueDate = dueDate;
        this.assignedUserId = assignedUserId;
        this.taskStatus = taskStatus;
    }

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
    public Long getProjectId() {
        return projectId;
    }
    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
    public Long getAssignedUserId() {
        return assignedUserId;
    }
    public void setAssignedUserId(Long assignedUserId) {
        this.assignedUserId = assignedUserId;
    }

    public String getTaskStatus() {
        return taskStatus;
    }

    public void setTaskStatus(String taskStatus) {
        this.taskStatus = taskStatus;
    }

    
}
