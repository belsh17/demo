package com.example.demo;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.entity.Client;
import com.entity.Project;
import com.entity.Role;
import com.entity.User;
import com.repository.ClientRepository;
import com.repository.ProjectRepository;
import com.repository.RoleRepository;
import com.repository.UserRepository;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class ProjectRepositoryTest {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

     @Autowired
    private ClientRepository clientRepository;

    @Test
    public void ProjectRepository_SaveAll_ReturnSavedProject(){
    
        //arrange
    Project project = new Project();

    project.setProjectName("Project Test");
    project.setProjDescription("Tetsing project storage");
    
    //client and project manager are objects so set with entities
    Client client = new Client();
    client.setClientName("Isabella Cardoso");
    //clientRepository.save(client);

    User projectManager = new User();
    projectManager.setFullName("Katarina Cardoso");
    

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    LocalDate startDate = LocalDate.parse("21/07/2025", formatter);
    LocalDate deadlineDate = LocalDate.parse("31/07/2025", formatter);
    
    project.setStartDate(startDate);
    project.setDeadlineDate(deadlineDate);

    project.setClient(client);
    project.setProjectManager(projectManager);
    
    //act
    Project savedProject = projectRepository.save(project);
    
    //assert
    Assertions.assertThat(savedProject).isNotNull();
    Assertions.assertThat(savedProject.getId()).isNotNull();

    }

    @Test
    public void ProjectRepository_findByProjectManager_ReturnProject(){
    
        //arrange
    Role userRole = new Role();
    userRole.setRoleName("USER");
    roleRepository.save(userRole);

    User user = new User();
    user.setUsername("katCar");
    user.setEmail("kat@example.com");
    user.setPassword("secure123");
    user.setFullName("Katarina Cardoso");
    user.setDashboardType("default");
    user.setRole(userRole);
        //act
    userRepository.save(user);
        //arrange
    Project project = new Project();
    project.setProjectName("Project Test");
    project.setProjDescription("Tetsing project storage");
    //client and project manager are objects so set with entities
    Client client = new Client();
    client.setClientName("Isabella Cardoso");
    clientRepository.save(client);

    // User projectManager = new User();
    // projectManager.setFullName("Katarina Cardoso");
    // userRepository.save(user);

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    LocalDate startDate = LocalDate.parse("21/07/2025", formatter);
    LocalDate deadlineDate = LocalDate.parse("31/07/2025", formatter);
    
    project.setStartDate(startDate);
    project.setDeadlineDate(deadlineDate);

    project.setClient(client);
    project.setProjectManager(user);
    
    //act
    projectRepository.save(project);
    List<Project> foundProjects = projectRepository.findByProjectManager(user);
    
    //assert
    Assertions.assertThat(foundProjects).isNotNull();
    Assertions.assertThat(foundProjects.get(0).getProjectManager().getFullName()).isEqualTo("Katarina Cardoso");

    }
}
