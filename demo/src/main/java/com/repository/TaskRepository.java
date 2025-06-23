package com.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.entity.Client;
import com.entity.Project;
import com.entity.Task;
import com.entity.User;

public interface TaskRepository extends JpaRepository<Task, Long>{
    List<Task> findAll();
    List<Task> findByProjectId(Long projectId);

    @Query("SELECT DISTINCT p.task FROM Project p WHERE p.projectManager = :user")
    List<Task> findTasksByProjectManager(@Param("user") User user);
}
