package com.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.entity.Project;
import com.entity.Team;
import com.repository.ProjectRepository;
import com.repository.TeamRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TeamRepository teamRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> search(
        @RequestParam("q") String query) {

            String q = query.toLowerCase();

            List<Map<String, Object>> projectResults = projectRepository.findByProjectNameContainingIgnoreCase(q)
                .stream()
                .map(p -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", p.getId());
                    map.put("name", p.getProjectName());
                    return map;
                }).toList();

            List<String> teamResults = teamRepository.findByTeamNameContainingIgnoreCase(q)
                .stream()
                .map(Team::getTeamName).toList();

            //Map<String, List<String>> results = new HashMap<>();
            Map<String, Object> results = new HashMap<>();
            results.put("projects", projectResults);
            results.put("teams", teamResults);
        return ResponseEntity.ok(results);
    }
    
}
