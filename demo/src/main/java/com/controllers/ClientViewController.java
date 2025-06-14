package com.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ClientViewController {
    
    @GetMapping("/client")
    public String showClientScreen() {
        return "client";
    }
    
}
