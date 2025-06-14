package com.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entity.Task;
import com.repository.TaskRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;
    
    public List<Task> getAllTasks(){
        return taskRepository.findAll();
    }

    public List<Task> getTasksByProjectId(Long projectId){
        return taskRepository.findByProjectId(projectId);
    }

    public Task saveTask(Task task){
        return taskRepository.save(task);
    }
}
