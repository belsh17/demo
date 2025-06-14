package com.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.entity.Project;
import com.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long>{
    List<Task> findAll();
    List<Task> findByProjectId(Long projectId);
}
