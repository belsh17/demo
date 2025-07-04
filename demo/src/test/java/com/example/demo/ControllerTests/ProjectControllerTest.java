package com.example.demo.ControllerTests;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;


import java.time.LocalDate;

import com.entity.Client;
import com.entity.Project;
import com.entity.User;

import com.repository.ClientRepository;
import com.repository.ProjectRepository;
import com.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
public class ProjectControllerTest {
    
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ProjectRepository projectRepository;

    private Long clientId;
    private Long managerId;

    //before each test we must save clients and users so it doesnt throw not found
    @BeforeEach
    void setUp(){
        //create and save client
        Client client = new Client();
        client.setClientName("Test Client");
        client.setAccountNumber("ACC123");
        client.setPhoneNumber("0623524587");
        clientRepository.save(client);
        clientId = client.getId();

        //create and save user (both manager and creator)
        User manager = new User();
        manager.setUsername("managerUser");
        manager.setEmail("manager@test.com");
        manager.setFullName("Manager Name");
        manager.setPassword("pass123");
        userRepository.save(manager);
        managerId = manager.getId();

        User creator = new User();
        creator.setUsername("jwtUser");
        creator.setEmail("jwt@test.com");
        creator.setFullName("JWT User");
        creator.setPassword("jwtPass");
        userRepository.save(creator);
    }


    @Test
    void ProjectController_createProject_returnsProjectDto() throws Exception{
       String jsonPayload = String.format("""
        {
            "projectName": "My Project",
            "projectDescription": "This is a test project",
            "startDate": "2025-06-30",
            "projectDeadline": "2025-07-15",
            "clientId": %d,
            "projectManagerId": %d

        }
        """, clientId, managerId);
       
        mockMvc.perform(post("/api/projects")
            //you must mock the jwt as well
                .with(jwt().jwt(jwt -> jwt.subject("jwtUser")))
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.projectName", is("My Project")))
            .andExpect(jsonPath("$.clientName", is("Test Client")))
            .andExpect(jsonPath("$.managerName", is("Manager Name")));
    }

    @Test
    void ProjectController_getProjectsForUserDisplay_returnsProjectDtos() throws Exception{

        Project project = new Project();
        project.setProjectName("Displayed Project");
        project.setProjDescription("Visible Project");
        project.setCreationDate(LocalDate.now());
        project.setStartDate(LocalDate.of(2025, 6, 30));
        project.setDeadlineDate(LocalDate.of(2025, 7, 30));
        project.setClient(clientRepository.findById(clientId).get());
        project.setComplete(true);
        User creator = userRepository.findByUsername("jwtUser").get();
        User manager = userRepository.findByUsername("managerUser").get();
        project.setCreatedBy(creator);
        project.setProjectManager(manager);
        projectRepository.save(project);
        projectRepository.flush();

         mockMvc.perform(get("/api/projects/user/display")
            //you must mock the jwt as well
                .with(jwt().jwt(jwt -> jwt.subject("jwtUser"))))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].projectName").value("Displayed Project"))
            .andExpect(jsonPath("$[0].clientName").value("Test Client"))
            .andExpect(jsonPath("$[0].managerName").value("Manager Name"))
             .andExpect(jsonPath("$[0].createdBy").isNumber());
            
    }
}
