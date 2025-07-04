package com.example.demo.ControllerTests;

import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.dto.CreateTeamDTO;
import com.dto.TeamMemberDTO;
import com.entity.Project;
import com.entity.Team;
import com.entity.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.repository.ProjectRepository;
import com.repository.TeamRepository;
import com.repository.UserRepository;
import com.repository.UserTeamsRepository;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
public class TeamControllerTest {
    
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserTeamsRepository userTeamsRepository;

    @Test
    void TeamController_createTeam_ReturnSavedTeam() throws Exception{
        
        Project project = new Project();
        project.setProjectName("Project Test");
        project.setProjDescription("Test project");
        project.setComplete(false);
        project.setStartDate(LocalDate.now());
        project.setDeadlineDate(LocalDate.now().plusDays(30));
        projectRepository.save(project);

       User user = new User();
       user.setUsername("testuser");
       user.setFullName("Test User");
       user.setPassword("pass123");
       user.setEmail("testuser@example.com");
       userRepository.save(user);

       CreateTeamDTO dto = new CreateTeamDTO();
       dto.setTeamName("Test Team");
       dto.setProjectId(project.getId());

       TeamMemberDTO member = new TeamMemberDTO();
       member.setUserId(user.getId());
       member.setTeamRole("Member");

       dto.setMembers(List.of(member));

       //convert to json
       String json = new ObjectMapper().writeValueAsString(dto);

        mockMvc.perform(post("/api/teams/create")
            //you must mock the jwt as well
                .with(jwt().jwt(jwt -> jwt.subject("jwtUser")))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.teamName", is("Test Team")));
   
    }
}
