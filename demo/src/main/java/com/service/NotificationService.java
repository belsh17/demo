// package com.service;

// import java.time.LocalDateTime;
// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.scheduling.annotation.Scheduled;
// import org.springframework.stereotype.Service;

// import com.entity.Project;
// import com.repository.ProjectRepository;

// @Service
// public class NotificationService{

//         @Autowired
//         private ProjectRepository projectRepository;

//         @Scheduled(fixedRate = 3600000) //Every hour
//         public void checkDeadlines(){
//             LocalDateTime now = LocalDateTime.now();
//             LocalDateTime upcoming = now.plusDays(1);

//             List<Project> nearingDeadline = projectRepository.findByDeadlineBetween(now, upcoming);

//             return nearingDeadline.stream()
//                 .filter(p -> p.getProjectManager().getId().equals(userId))
//                 .map(p -> "Project '" + p.name() + "' is due by " + p.getDeadlineDate().toLocalDate())
//                 .toList();
//         }
// }