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
import com.entity.Task;
import com.entity.TaskStatus;
import com.entity.User;
import com.repository.ClientRepository;
import com.repository.ProjectRepository;
import com.repository.TaskRepository;
import com.repository.UserRepository;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Test
    public void TaskRepository_SaveAll_ReturnSavedTasks(){

        //arrange
        Task task = new Task();
        task.setTaskName("Test Task");
        task.setTaskDescription("Task storage description");
        
        TaskStatus taskStatus = TaskStatus.INCOMPLETE;
        task.setTaskStatus(taskStatus);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LocalDate dueDate = LocalDate.parse("21/07/2025", formatter);
    
        task.setDueDate(dueDate);

        LocalDate creationDate = LocalDate.now();
    
        task.setCreationDate(creationDate);

        User assignedUser = new User();
        assignedUser.setFullName("Test User");

        task.setAssignedUser(assignedUser);

        //act
        Task savedTask = taskRepository.save(task);

        //assert
        Assertions.assertThat(savedTask).isNotNull();
        Assertions.assertThat(savedTask.getId()).isNotNull();
        Assertions.assertThat(savedTask.getTaskName()).isEqualTo("Test Task");

    }
    
    @Test
    public void TaskRepository_FindById_ReturnsTaskById(){

        taskRepository.deleteAll();
        //arrange
        Task task = new Task();
        task.setTaskName("Test Task");
        task.setTaskDescription("Task storage description");
        
        TaskStatus taskStatus = TaskStatus.INCOMPLETE;
        task.setTaskStatus(taskStatus);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LocalDate dueDate = LocalDate.parse("21/07/2025", formatter);
    
        task.setDueDate(dueDate);

        LocalDate creationDate = LocalDate.now();
    
        task.setCreationDate(creationDate);

        User assignedUser = new User();
        assignedUser.setFullName("Test User");

        task.setAssignedUser(assignedUser);

        //act
        taskRepository.save(task);

        Task taskReturn = taskRepository.findById(task.getId()).get();

        //assert
        Assertions.assertThat(taskReturn).isNotNull();
        Assertions.assertThat(taskReturn.getId()).isNotNull();

    }

    @Test
    public void TaskRepository_FindByProjectId_ReturnsTaskByProjectId(){

        taskRepository.deleteAll();
         projectRepository.deleteAll();
        //arrange
        User user = new User();
        user.setUsername("bellaCar17");
        user.setEmail("bellatest@example.com");
        user.setPassword("puppy17");
        user.setFullName("Isabella Cardoso");
        user.setDashboardType("default");
        userRepository.save(user);

        //arrange - save project manager
        User projectManager = new User();
        projectManager.setUsername("katarinaCar30");
        projectManager.setEmail("kat@example.com");
        projectManager.setPassword("securePass");
        projectManager.setFullName("Katarina Cardoso");
        projectManager.setDashboardType("default");
        userRepository.save(projectManager);

        //arrange client and project manager are objects so set with entities
        Client client = new Client();
        client.setClientName("Isabella Cardoso");
        clientRepository.save(client);

        Project project = new Project();
        project.setProjectName("Project Test");
        project.setProjDescription("Tetsing project storage");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LocalDate startDate = LocalDate.parse("21/07/2025", formatter);
        LocalDate deadlineDate = LocalDate.parse("31/07/2025", formatter);
        project.setClient(client);
        project.setProjectManager(projectManager);
        project.setStartDate(startDate);
        project.setDeadlineDate(deadlineDate);
        Project savedProject = projectRepository.save(project);

        //arrange - assigned user
        User assignedUser = new User();
        assignedUser.setUsername("testUser12");
        assignedUser.setEmail("testuser@example.com");
        assignedUser.setPassword("testPass");
        assignedUser.setFullName("Test User");
        assignedUser.setDashboardType("default");
        userRepository.save(assignedUser);

        //arrange - task
        Task task = new Task();
        task.setTaskName("Test Task");
        task.setTaskDescription("Task storage description");
        task.setTaskStatus(TaskStatus.INCOMPLETE);
        task.setDueDate(LocalDate.parse("21/07/2025", formatter));
        task.setCreationDate(LocalDate.now());
        task.setAssignedUser(assignedUser);
        task.setProject(savedProject);

        //act
        taskRepository.save(task);

        List<Task> tasks = taskRepository.findByProjectId(savedProject.getId());

        //assert
        Assertions.assertThat(tasks).isNotNull();
        Assertions.assertThat(tasks.get(0).getProject().getId()).isEqualTo(project.getId());

    }
    
    
}
