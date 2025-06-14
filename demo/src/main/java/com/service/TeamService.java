package com.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entity.Project;
import com.entity.Team;
import com.repository.ProjectRepository;
import com.repository.TeamRepository;

@Service
public class TeamService {

    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private TeamRepository teamRepository;

    TeamService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Team getTeamsByProjectId(Long projectId){
        return teamRepository.findByProjectId(projectId)
            .orElseThrow(() -> new RuntimeException("Team not found for project ID: " + projectId));
    }

    public Team saveTeam(Team team){
        return teamRepository.save(team);
    }

    public List<Project> getAllProjects(){
        return projectRepository.findAll();
    }

}
