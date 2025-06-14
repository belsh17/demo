package com.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


//need this to view dashboard with Thymeleaf
@Controller
public class DashboardController {

        @GetMapping("/defaultDashboard")
        public String defaultDashboard() {
            return "defaultDashboard";
        }

        @GetMapping("/customizableDashboard")
        public String customizableDashboard() {
            return "customizableDashboard";
        }
        
}
