package com.example.demo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Date;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.entity.Project;
import com.entity.Task;
import com.entity.User;
import com.repository.TaskRepository;
import com.service.TaskService;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void TaskService_CreateTask_ReturnSavedTask(){
    try{
        //ARRANGE
        User userAssigned = new User();
        userAssigned.setFullName("Isabella Cardoso");

        Project project = new Project();
        project.setProjectName("Task Project");
        
        Task mockTask = new Task();
        mockTask.setTaskName("Testing task");
        mockTask.setTaskDescription("Testing task service");
        mockTask.setDueDate(LocalDate.now());
        mockTask.setCreationDate(LocalDate.now());
        mockTask.setProject(project);
        mockTask.setAssignedUser(userAssigned);
        mockTask.setId(1L); //L for LONG
    
        when(taskRepository.save(any(Task.class))).thenReturn(mockTask);
        
        //ACT
        Task savedTask = taskService.saveTask(mockTask);

        //ASSERT
        assertNotNull(savedTask);
        assertEquals("Testing task", savedTask.getTaskName());
        assertEquals("Isabella Cardoso", savedTask.getAssignedUser().getFullName());
        assertEquals("Task Project", savedTask.getProject().getProjectName());

        verify(taskRepository).save(any(Task.class));
    }catch(Exception e) {
        e.printStackTrace();
    }
    }
}
