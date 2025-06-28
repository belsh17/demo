package com.dto;

public class GanttChartDto {

    private Long id;
    private String taskName;
    private String start;
    private String end;
    private int progress;
    // private Long projectId;

    // public Long getProjectId() {
    //     return projectId;
    // }

    // public void setProjectId(Long projectId) {
    //     this.projectId = projectId;
    // }

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
    public String getStart() {
        return start;
    }
    public void setStart(String start) {
        this.start = start;
    }
    public String getEnd() {
        return end;
    }
    public void setEnd(String end) {
        this.end = end;
    }
    public int getProgress() {
        return progress;
    }
    public void setProgress(int progress) {
        this.progress = progress;
    }

    
}
