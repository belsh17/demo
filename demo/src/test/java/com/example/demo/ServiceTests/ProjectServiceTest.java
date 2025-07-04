package com.example.demo.ServiceTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import com.entity.User;
import com.dto.ProjectDto;
import com.entity.Client;
import com.entity.Project;
import com.entity.Role;
import com.repository.ClientRepository;
import com.repository.ProjectRepository;
import com.repository.UserRepository;
import com.service.ProjectService;

@ExtendWith(MockitoExtension.class)
public class ProjectServiceTest {
    
    @Mock 
    private ProjectRepository projectRepository;

    // @Mock 
    // private ManagerRepository managerRepository;

    //mocking repositroy so it doesnt use the actual database
    @Mock 
    private ClientRepository clientRepository;

    @Mock 
    private UserRepository userRepository;

    @InjectMocks
    private ProjectService projectService;

    //initializes Mockito so mocks can work properly before ea test run
    @BeforeEach
    void setup(){
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateProjectWithNewClient_ShouldCreateClientAndProject(){

        String clientName = "bob";
        String projectName = "moses plan";

        Client client = new Client();
        client.setClientName(clientName);

        // Project project = new Project();
        // project.setProjectName(projectName);

        System.out.println("Step 1: Created the project and client");

        //Step 1 Mock findByClientName to simulate "client doesn't exist"
        when(clientRepository.findByClientName(clientName)).thenReturn(Optional.empty());

        //Step 2 Mock saving new client
        when(clientRepository.save(any(Client.class))).thenReturn(client);
        System.out.println("Step 2: Mocked clientRepository.save");
        //Step 3 Mock saving the project
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> {
            Project p = invocation.getArgument(0);
            p.setClient(client); //simulate link
            return p;
        });

        Project savedProject = projectService.createProjectWithClient(clientName, projectName);
        System.out.println("Step 3: Mocked projectRepository.save");

        //Assertions
        assertNotNull(savedProject);
        assertEquals(projectName, savedProject.getProjectName());
        assertNotNull(savedProject.getClient());
        assertEquals(clientName, savedProject.getClient().getClientName());

        verify(clientRepository, times(1)).findByClientName(clientName);
        verify(clientRepository, times(1)).save(any(Client.class));
        verify(projectRepository, times(1)).save(any(Project.class));
        System.out.println("Step 5: Verify passed");
    }

    @Test
    void testCreateProjectWithNewManager_ShouldCreateManagerAndProject(){

        String projectManagerName = "alice";
        String projectName = "sugeee plan";

        //ProjectManager projectManager = new ProjectManager();
        User manager = new User();
        manager.setUsername(projectManagerName);
        Role managerRole = new Role();
        managerRole.setRoleName("PROJECT_MANAGER");
        manager.setRole(managerRole);
        //projectManager.setProjectManagerName(projectManagerName);

        // Project project = new Project();
        // project.setProjectName(projectName);

        System.out.println("Step 1: Created the project and client");

        //Step 1 Mock findByClientName to simulate "client doesn't exist"
        //when(managerRepository.findByProjectManagerName(projectManagerName)).thenReturn(Optional.empty());
        when(userRepository.findByUsername(projectManagerName)).thenReturn(Optional.of(manager));

        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> {
            Project p = invocation.getArgument(0);
            p.setProjectManager(manager);
            return p;
        });
        //Step 2 Mock saving new client
        // when(managerRepository.save(any(ProjectManager.class))).thenReturn(projectManager);
        // System.out.println("Step 2: Mocked managerRepository.save");
        // //Step 3 Mock saving the project
        // when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> {
        //     Project p = invocation.getArgument(0);
        //     p.setProjectManager(projectManager); //simulate link
        //     return p;
        // });

        Project savedProject = projectService.createProjectWithManager(projectManagerName, projectName);
        System.out.println("Step 3: Mocked projectRepository.save");

        //Assertions
        assertNotNull(savedProject);
        assertEquals(projectName, savedProject.getProjectName());
        assertNotNull(savedProject.getProjectManager());
        assertEquals(projectManagerName, savedProject.getProjectManager().getUsername());

        //verify(managerRepository, times(1)).findByProjectManagerName(projectManagerName);
        //verify(managerRepository, times(1)).save(any(ProjectManager.class));
        verify(userRepository, times(1)).findByUsername(projectManagerName);
        verify(projectRepository, times(1)).save(any(Project.class));
        System.out.println("Step 5: Verify passed");
    }

    @Test
    void ProjectService_testCreateProjectWithClientAndManager_ShouldLinkBoth(){
        //setup data transfer object as we use this for that function
        ProjectDto dto = new ProjectDto();
        dto.setProjectName("Padel Project");
        dto.setClientName("KyaSands");
        dto.setManagerName("Katarina Cardoso");
        dto.setCreatedBy(1L);

        //mock/fake client
        Client client = new Client();
        client.setClientName(dto.getClientName());
        when(clientRepository.findByClientName(dto.getClientName())).thenReturn(Optional.empty());
        when(clientRepository.save(any(Client.class))).thenReturn(client);

        User manager = new User();
        manager.setFullName(dto.getManagerName());
        Role role = new Role();
        role.setRoleName("PROJECT_MANAGER");
        manager.setRole(role);
        when(userRepository.findByFullName(dto.getManagerName())).thenReturn(Optional.of(manager));

        //mock user
        User creator =  new User();
        //ProjectManager user = new ProjectManager();
        creator.setId(dto.getCreatedBy());
        creator.setUsername("Admin");
        when(userRepository.findById(dto.getCreatedBy())).thenReturn(Optional.of(creator));

        //mock saving project
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> {
                Project p = invocation.getArgument(0);
                p.setClient(client);
                p.setProjectManager(manager);
                p.setCreatedBy(creator);
                //p.setCreatedBy(user);
                return p;
        });

        //run service 
        Project result = projectService.createProjectWithClientAndManager(dto);
    
        //assertions
        assertNotNull(result);
        assertEquals(dto.getProjectName(), result.getProjectName());
        assertNotNull(result.getClient());
        assertEquals(dto.getClientName(), result.getClient().getClientName());
        assertNotNull(result.getProjectManager());
        assertEquals(dto.getManagerName(), result.getProjectManager().getFullName());
        //assertEquals(user, result.getCreatedBy());
        assertEquals(creator, result.getCreatedBy());

        verify(clientRepository).save(any(Client.class));
        //verify(managerRepository).save(any(ProjectManager.class));
        verify(userRepository).findById(dto.getCreatedBy());
        verify(projectRepository).save(any(Project.class));
    }

}
