package com.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
public class CalendarViewController {

    // @GetMapping("/calendar")
    // public String showCalendar(@RequestParam(required = false) String linked,Model model ){
    //     Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    //     boolean isAuthenticated = auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser");

    //     model.addAttribute("isAuthenticated", isAuthenticated);
    //     model.addAttribute("linked", linked != null);
        
    //     return "calendar";
    // }
    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;

     @GetMapping("/calendar")
    public String showCalendar(
        Model model ){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser");

        model.addAttribute("isAuthenticated", isAuthenticated);
        //model.addAttribute("linked", linked != null);
        String username = auth.getName();
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient("google", username);
        boolean isLinked = client != null;

        model.addAttribute("linked", isLinked);

        return "calendar";
    }
}
