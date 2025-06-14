package com.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long>{
    //Optional<Project> findByProjectName(String projectName);
    List<Project> findAll();
    List<Project> findByUser();
}

