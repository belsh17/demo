package com.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.entity.Project;
import com.entity.Team;
import com.entity.User;

public interface ProjectRepository extends JpaRepository<Project, Long>{
    //Optional<Project> findByProjectName(String projectName);
    List<Project> findAll();
    List<Project> findByProjectManager(User user);
    List<Project> findByProjectManagerAndDeadlineDateBetween(User projectManager, LocalDate from, LocalDate to);
    List<Project> findByProjectNameContainingIgnoreCase(String name);
    List<Project> findByProjectManagerOrCreatedBy(User manager, User creator);
}

