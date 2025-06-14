package com.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.entity.Project;
import com.entity.Team;
import com.entity.UserTeams;

public interface UserTeamsRepository extends JpaRepository<UserTeams, Long> {
    List<UserTeams> findByTeamsContains(Team team);
}
