package com.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.dto.CreateTeamDTO;
import com.dto.TeamDto;
import com.entity.Project;
import com.entity.Task;
import com.entity.Team;
import com.entity.User;
import com.entity.UserTeams;
import com.repository.ProjectRepository;
import com.repository.TeamRepository;
import com.repository.UserTeamsRepository;
import com.service.TeamService;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties.Jwt;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"}) 
public class TeamController {

    @Autowired
    private TeamService teamService;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserTeamsRepository userTeamsRepository;
    
    @GetMapping("/projects/{projectId}/teams")
    public ResponseEntity<Team>  getTeamsByProject(@PathVariable Long projectId) {

        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        Team team = teamRepository.findByProject(project);

        if(team == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(team);
        //return teamService.getTeamsByProjectId(projectId);
    }

    @GetMapping("/teams")
    public List<Team> getTeams() {
        List<Team> team = teamRepository.findAll();
        return team;
    }

    @GetMapping("/teams/users")
    public List<TeamDto> getTeamsWithUsers() {
        List<Team> teams = teamRepository.findAll();
        return teams.stream().map(team -> {
            List<User> users = userTeamsRepository.findByTeamsContains(team)
            .stream()
            .map(UserTeams::getUser)
            .collect(Collectors.toList());

            return new TeamDto(team.getId(), team.getTeamName(), users);
   
        }).collect(Collectors.toList());

}
    

    //code for creating team
    @PostMapping("/teams/create")
    public ResponseEntity<Team> createTeam(
        @RequestBody CreateTeamDTO dto,
        @AuthenticationPrincipal Jwt jwt
        ) {
         Team team = new Team();
         team.setTeamName(dto.getTeamName());
         
         Project project = projectRepository.findById(dto.getProjectId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        
        team.setProject(project);

        Team saved  = teamRepository.save(team);

        return ResponseEntity.ok(saved);
    }
    
    
}
