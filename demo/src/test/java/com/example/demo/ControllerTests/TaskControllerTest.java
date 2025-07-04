package com.example.demo.ControllerTests;

import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.entity.Client;
import com.entity.Project;
import com.entity.User;
import com.repository.ProjectRepository;
import com.repository.TaskRepository;
import com.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
public class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    private Long projectId;
    private Long userId;

     @BeforeEach
    void setUp(){

        User creator = new User();
        creator.setUsername("jwtUser");
        creator.setEmail("jwt@test.com");
        creator.setFullName("JWT User");
        creator.setPassword("jwtPass");
        userRepository.save(creator);

        //create and save user (both manager and creator)
        User manager = new User();
        manager.setUsername("managerUser");
        manager.setEmail("manager@test.com");
        manager.setFullName("Manager Name");
        manager.setPassword("pass123");
        userRepository.save(manager);

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
    void TaskController_createTask_ReturnsTaskDto() throws Exception{
        String jsonPayload = String.format("""
        {
            "taskName": "Test Task",
            "taskDescription": "This is a test",
            "dueDate": "2025-07-15",
            "assignedUserId": %d,
            "taskStatus": "INCOMPLETE"

        }
        """, userId, projectId);

        //  "projectId": %d,
        //"creationDate": "2025-06-30",

        mockMvc.perform(post("/api/projects/" + projectId + "/tasks")
            //you must mock the jwt as well
                .with(jwt().jwt(jwt -> jwt.subject("jwtUser")))
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
            .andDo(print())
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.taskName", is("Test Task")));
            //.andExpect(jsonPath("$.taskStatus", is("INCOMPLETE")));
    
    }
}
