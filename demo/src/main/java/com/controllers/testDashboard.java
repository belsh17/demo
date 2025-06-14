package com.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

public class testDashboard {
    
    @GetMapping("/api/dashboard/test")
    public ResponseEntity<String> testingDashboard(){
        return ResponseEntity.ok("Dashboard endpoint working!");
    }
}
