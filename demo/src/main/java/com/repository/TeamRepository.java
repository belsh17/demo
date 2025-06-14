package com.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.entity.Project;
import com.entity.Team;

public interface TeamRepository extends JpaRepository<Team, Long>{
    Optional<Team> findByProjectId(Long projectId);
    Team findByProject(Project project);
}
