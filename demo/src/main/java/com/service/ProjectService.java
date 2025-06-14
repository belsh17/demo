package com.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Autowired;
import com.entity.User;
import org.springframework.stereotype.Service;

import com.dto.ProjectDto;
import com.dto.SPointDTO;
import com.entity.Client;
import com.entity.Project;
// import com.entity.ProjectManager;
import com.repository.ClientRepository;
import com.repository.ProjectRepository;
import com.repository.UserRepository;

@Service
public class ProjectService {
    //injects UserRepositpry(which tals to db) and PasswordEncoder(to hash and compare passwords)
        @Autowired
        private ClientRepository clientRepository;

        @Autowired
        private ProjectRepository projectRepository;

        // @Autowired
        // private ManagerRepository managerRepository;

        @Autowired
        private UserRepository userRepository;


        public Project createProjectWithClient(String clientName, String projectName){
            //check if client exists
            Client client = clientRepository.findByClientName(clientName)
                .orElseGet(() -> {
                    Client newClient = new Client();
                    newClient.setClientName(clientName);
                    return clientRepository.save(newClient);
                });

                Project project = new Project();
                project.setProjectName(projectName);
                project.setClient(client);

                return projectRepository.save(project);
        }

        //handles
        public Client linkClientProject(Client client){
            
            client.setClientName(client.getClientName());
            return clientRepository.save(client);
        }

        public Project createProjectWithManager(String projectManagerName, String projectName){
            //check if client exists
            //ProjectManager manager = managerRepository.findByProjectManagerName(projectManagerName)
            User manager = userRepository.findByUsername(projectManagerName)
                // .orElseGet(() -> {
                //     ProjectManager newProjectManager = new ProjectManager();
                //     newProjectManager.setProjectManagerName(projectManagerName);
                //     return managerRepository.save(newProjectManager);
                // });
                .orElseThrow(() -> new RuntimeException("Manager not found with username: " + projectManagerName));

                Project project = new Project();
                project.setProjectName(projectName);
                project.setProjectManager(manager);

                return projectRepository.save(project);
        }

        //function for creating project with names of client and manabegr
        public Project createProjectWithClientAndManager(ProjectDto dto){
            Client client = clientRepository.findByClientName(dto.getClientName())
                .orElseGet(() -> {
                    Client newClient = new Client();
                    newClient.setClientName(dto.getClientName());
                    newClient.setAccountNumber(dto.getClientAccount());
                    return clientRepository.save(newClient);
                });

            User manager = userRepository.findByFullName(dto.getManagerName())
                 .orElseThrow(() -> new RuntimeException("Project manager not found: " + dto.getManagerName()));

            User creator = userRepository.findById(dto.getCreatedBy())
                 .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.getCreatedBy()));

            Project project = new Project();
            project.setProjectName(dto.getProjectName());
            project.setProjDescription(dto.getProjDescription());
            project.setStartDate(dto.getStartDate());
            project.setDeadlineDate(dto.getDeadlineDate());
            project.setCreationDate(dto.getCreationDate() != null ? dto.getCreationDate() : LocalDate.now());
            project.setClient(client);
            project.setProjectManager(manager);
            //project.setCreatedBy(user);
            project.setCreatedBy(creator);

            return projectRepository.save(project);
        }

        //code for displaying graph on dasdhbnoard
        public List<SPointDTO> generateSCurveData(Project project){
            List<SPointDTO> points = new ArrayList<>();
            LocalDate start = project.getStartDate();
            LocalDate end = project.getDeadlineDate();
            long days = ChronoUnit.DAYS.between(start, end);

            for(int i = 0; i <= days; i += 5){
                LocalDate date = start.plusDays(i);
                double t = (double) i / days;
                double progress = Math.pow(t, 2) / (Math.pow(t, 2) + Math.pow(1 - t, 2)) * 100;
                points.add(new SPointDTO(date, Math.round(progress * 10) / 10.0));
            }
            return points;
        }

}
