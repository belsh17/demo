package com.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.entity.Project;
import com.entity.Team;
import com.entity.UserTeams;

public interface UserTeamsRepository extends JpaRepository<UserTeams, Long> {
    //List<UserTeams> findByTeamsContains(Team team);

    List<UserTeams> findByTeam(Team team);

    // @Query("SELECT ut FROM UserTeams ut JOIN ut.teams t WHERE t = :team")
    // List<UserTeams> findByTeam(@Param("team") Team team);
}
