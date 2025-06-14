//used to display deadlines of project in another way
package com.dto;

import java.time.LocalDate;

public class ProjectDeadlineDTO {
    private Long id;
    private String name;
    private LocalDate deadline;

    public ProjectDeadlineDTO(Long id, String name, LocalDate deadline) {
        this.id = id;
        this.name = name;
        this.deadline = deadline;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    
    
}
