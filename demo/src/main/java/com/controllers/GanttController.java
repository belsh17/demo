package com.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.dto.GanttChartDto;
import com.entity.Gantt;
import com.repository.GanttRepository;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;




@RestController
@RequestMapping
("/api/gantt")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"}) //Allows CORS if using live server frontend
public class GanttController {

    @Autowired
    private GanttRepository ganttRepository;

    // @GetMapping("/project/{projectId}")
    // public ResponseEntity<List<GanttChartDto>> getTasksByProject(
    //     @PathVariable Long projectId) {
        
    //     List<Gantt> tasks = ganttRepository.findByProjectId(projectId);    
    //     List<GanttChartDto> dtos = tasks.stream().map(task -> {
    //         GanttChartDto dto = new GanttChartDto();
    //         dto.setId(task.getId());
    //         dto.setTaskName(task.getTaskName());
    //         dto.setStart(task.getStart());
    //         dto.setEnd(task.getEnd());
    //         dto.setProgress(task.getProgress());
    //         dto.setProjectId(task.getProjectId());
    //         return dto;
    //     }).toList();

    //     return ResponseEntity.ok(dtos);
    // }

    @GetMapping("/all")
    public ResponseEntity<List<GanttChartDto>> getAllTasks() {
        
        List<Gantt> tasks = ganttRepository.findAll();    
        List<GanttChartDto> dtos = tasks.stream().map(task -> {
            GanttChartDto dto = new GanttChartDto();
            dto.setId(task.getId());
            dto.setTaskName(task.getTaskName());
            dto.setStart(task.getStart());
            dto.setEnd(task.getEnd());
            dto.setProgress(task.getProgress());
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
    }
    

    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    @PostMapping("/save")
    public ResponseEntity<GanttChartDto> createGantt(
        @RequestBody GanttChartDto dto,
        Principal principal) {

        Gantt gantt = new Gantt();
        gantt.setTaskName(dto.getTaskName());
        gantt.setStart(dto.getStart());
        gantt.setEnd(dto.getEnd());
        gantt.setProgress(0);

        Gantt saved = ganttRepository.save(gantt);

        GanttChartDto savedDto = new GanttChartDto();
        savedDto.setId(saved.getId());
        savedDto.setTaskName(saved.getTaskName());
        savedDto.setStart(saved.getStart());
        savedDto.setEnd(saved.getEnd());
        savedDto.setProgress(saved.getProgress());
        
        return ResponseEntity.ok(savedDto);
    }
    

}
