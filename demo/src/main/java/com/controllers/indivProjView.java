package com.controllers;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class indivProjView {
    
    @GetMapping("/indivProject")
    public String showIndivProject(){        
        return "indivProject";
    }
}
