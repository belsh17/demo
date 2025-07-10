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

    //handle HTTP GET requests to the base path of this controller 
    @GetMapping
    public ResponseEntity<Map<String, Object>> search(
        @RequestParam("q") String query) {

            //convert input query to lowercase for case-insensitive searching
            String q = query.toLowerCase();

            //search for projects whose names contain the query string ^^
            //Then map each project to a simplified format: a map with "id" & "name"
            List<Map<String, Object>> projectResults = projectRepository.findByProjectNameContainingIgnoreCase(q)
                .stream()
                .map(p -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", p.getId()); //add project id to map
                    map.put("name", p.getProjectName()); //add project name to map
                    return map;
                }).toList(); //collect the mapped results into the list

            //search for teams whose names contain the query string ^^
            //Only return team names
            List<String> teamResults = teamRepository.findByTeamNameContainingIgnoreCase(q)
                .stream()
                .map(Team::getTeamName).toList(); //extract only the name of each team

            //Map<String, List<String>> results = new HashMap<>();
            //create result map that holds both project and team search results
            Map<String, Object> results = new HashMap<>();
            results.put("projects", projectResults); //add project search results to the map
            results.put("teams", teamResults); //add team search results to the map
        //return the result map in HTTP response with 200 ok status
        return ResponseEntity.ok(results);
    }
    
}
