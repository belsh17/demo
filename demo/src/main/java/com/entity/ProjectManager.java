// package com.entity;

// import java.util.List;

// import jakarta.persistence.*;

// @Entity
// @DiscriminatorValue("PROJECT_MANAGER")
// public class ProjectManager extends User{

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     private String projectManagerName;

//     @OneToMany(mappedBy = "projectManager")
//     private List<Project> projects;

//     public Long getId() {
//         return id;
//     }

//     public void setId(Long id) {
//         this.id = id;
//     }

//     public String getProjectManagerName() {
//         return projectManagerName;
//     }
//     public void setProjectManagerName(String projectManagerName) {
//         this.projectManagerName = projectManagerName;
//     }

//     public List<Project> getProjects() {
//         return projects;
//     }

//     public void setProjects(List<Project> projects) {
//         this.projects = projects;
//     }

// }
