package com.example.demo.ServiceTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.entity.Team;
import com.repository.ProjectRepository;
import com.repository.TeamRepository;
import com.service.TeamService;

@ExtendWith(MockitoExtension.class)
public class TeamServiceTest {

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private TeamService teamService;
    
    @Test
    public void TeamService_SaveTeam_ReturnSavedTeam(){
       

    }

    @Test
    public void TeamService_getTeamsByProjectId_Returnsteam(){
       Long projectId = 1L;
       Team mockTeam = new Team();
       mockTeam.setId(10L);

       when(teamRepository.findByProjectId(projectId)).thenReturn(Optional.of(mockTeam));
      
       Team team = teamService.getTeamsByProjectId(projectId);

       assertNotNull(team);
       assertEquals(10L, team.getId());
       verify(teamRepository).findByProjectId(projectId);

    }


}
