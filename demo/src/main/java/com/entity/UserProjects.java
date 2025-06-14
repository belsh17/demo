package com.entity;

import java.util.Set;

import jakarta.persistence.*;

@Entity
@Table(name = "userProjects")
public class UserProjects {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String projectRole;

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "projectId")
    private Project project;

    // @ManyToMany
    // @JoinTable(
    //     name = "User_project", 
    //     joinColumns = @JoinColumn(name = "user_projects_id"),
    //     inverseJoinColumns = @JoinColumn(name = "project_id")
    // )
    // private Set<Project> projects;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProjectRole() {
        return projectRole;
    }

    public void setProjectRole(String projectRole) {
        this.projectRole = projectRole;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    // public Set<Project> getProjects() {
    //     return projects;
    // }

    // public void setProjects(Set<Project> projects) {
    //     this.projects = projects;
    // }

}
