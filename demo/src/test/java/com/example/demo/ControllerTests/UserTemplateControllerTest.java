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

import java.time.LocalDate;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

import com.entity.Client;
import com.entity.Project;
import com.entity.User;
import com.repository.ClientRepository;
import com.repository.ProjectRepository;
import com.repository.TaskRepository;
import com.repository.UserRepository;
import com.repository.UserTemplatesRepository;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
public class UserTemplateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserTemplatesRepository userTemplatesRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClientRepository clientRepository;

    private Long projectId;
    private Long userId;

    @BeforeEach
    void setUp(){
        //create and save client
        Client client = new Client();
        client.setClientName("Test Client");
        client.setAccountNumber("ACC123");
        client.setPhoneNumber("0623524587");
        clientRepository.save(client);

        //create and save user (both manager and creator)
        User manager = new User();
        manager.setUsername("managerUser");
        manager.setEmail("manager@test.com");
        manager.setFullName("Manager Name");
        manager.setPassword("pass123");
        userRepository.save(manager);

        User creator = new User();
        creator.setUsername("jwtUser");
        creator.setEmail("jwt@test.com");
        creator.setFullName("JWT User");
        creator.setPassword("jwtPass");
        userRepository.save(creator);

         Project project = new Project();
        project.setProjectName("My Project");
        project.setProjDescription("A Test Project");
        project.setCreationDate(LocalDate.now());
        project.setStartDate(LocalDate.of(2025, 6, 30));
        project.setDeadlineDate(LocalDate.of(2025, 7, 30));
        project.setComplete(true);
        project.setCreatedBy(creator);
        project.setProjectManager(manager);
        projectRepository.save(project);

        projectId = project.getId();
        userId = creator.getId();
    }

    @Test
    void UserTemplatesController_saveTemplate_returnsTemplateResponse() throws Exception{
        String jsonPayload = String.format("""
        {
            "templateName": "My Template",
            "templateType": "Generic",
            "templateData": "amounts",
            "projectId": %d

        }
        """, projectId);
       
        mockMvc.perform(post("/api/user-templates/save")
            //you must mock the jwt as well
                .with(jwt().jwt(jwt -> jwt.subject("jwtUser")))
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(content().string("Template saved!"));
        }
    
}
