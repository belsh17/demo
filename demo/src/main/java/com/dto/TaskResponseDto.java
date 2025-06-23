package com.dto;

import java.time.LocalDate;

import com.entity.Task;

public class TaskResponseDto {

    private Long id;
    private String taskName;
    private String taskDescription;
    private LocalDate dueDate;
    //private Long projectId;
    private Long assignedUserId;
    private Long projectId;
    private String taskStatus;

    
    public TaskResponseDto(Task task) {
        this.id = task.getId();
        this.taskName = task.getTaskName();
        this.taskDescription = task.getTaskDescription();
        this.dueDate = task.getDueDate();
        this.assignedUserId = task.getAssignedUser() != null ? task.getAssignedUser().getId() : null;
        this.projectId = task.getProject() != null ? task.getProject().getId() : null;
        this.taskStatus = task.getTaskStatus().toString();
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
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
    public LocalDate getDueDate() {
        return dueDate;
    }
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    public Long getAssignedUserId() {
        return assignedUserId;
    }
    public void setAssignedUserId(Long assignedUserId) {
        this.assignedUserId = assignedUserId;
    }
    public Long getProjectId() {
        return projectId;
    }
    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
    public String getTaskStatus() {
        return taskStatus;
    }
    public void setTaskStatus(String taskStatus) {
        this.taskStatus = taskStatus;
    }

    
}
