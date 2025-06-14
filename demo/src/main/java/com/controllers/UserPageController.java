package com.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class UserPageController {

        @GetMapping("/signup")
        public String getSignupPage() {
            return "index";
        }
        
}
