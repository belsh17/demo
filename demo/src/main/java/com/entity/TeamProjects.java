package com.entity;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "teamProjects")
public class TeamProjects {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany
    @JoinColumn(name = "projectId", referencedColumnName = "id")
    private List<Project> project;

    @ManyToOne
    @JoinColumn(name = "teamId", referencedColumnName = "id")
    private Team team;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


}
