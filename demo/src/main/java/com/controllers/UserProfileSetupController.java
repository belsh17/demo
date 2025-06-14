// package com.controllers;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.Authentication;
// import org.springframework.stereotype.Controller;
// import org.springframework.ui.Model;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.ModelAttribute;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestMapping;

// import com.entity.User;
// import com.repository.UserRepository;
// import com.service.AdminService;

// import lombok.RequiredArgsConstructor;

// @Controller
// @RequestMapping("/user")
// @RequiredArgsConstructor
// public class UserProfileSetupController {
    
//     @Autowired
//     private AdminService userService;

//     @Autowired
//     private UserRepository userRepository;

//     @GetMapping("/setup-profile")
//     public String showProfileForm(Authentication authentication, Model model) {
//         String username = authentication.getName();
//         User user = userService.getUserByUsername(username);
//         model.addAttribute("user", user);
//         return "setup-profile"; //refers to the setup profile html
//     }

//     @PostMapping("/setup-profile")
//     public String saveProfile(@ModelAttribute("user") User updatedUser,Authentication authentication) {
//         String username = authentication.getName();
//         User user = userService.getUserByUsername(username);
        
//         user.setProjectManagerName(updatedUser.getProjectManagerName());
//         userRepository.save(user);
//         return "redirect:/dashboard";
//     }
// }
