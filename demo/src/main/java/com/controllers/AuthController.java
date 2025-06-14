package com.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.LoginRequest;
import com.dto.AuthenticationRequestDto;
import com.dto.AuthenticationResponseDto;
import com.service.AuthenticationService;
//import com.service.CustomUserDetailsService;
import com.service.LoginResponse;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.RequiredArgsConstructor;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;




@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    // //from security config
    // @Autowired
    // private AuthenticationManager authenticationManager;

    // //service
    // @Autowired
    // private CustomUserDetailsService userDetailsService;

    private final AuthenticationService authenticationService;

    //post to /login so link is api/users/login
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDto> authenticate(
        @RequestBody final AuthenticationRequestDto authenticationRequestDto
        ) {
        //try{
                return ResponseEntity.ok(authenticationService.authenticate(authenticationRequestDto));
            
            //} catch(BadCredentialsException e){
            //return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        //}
    }

    @GetMapping("/login")
    public String getLoginPage() {
        return "login";
    }
    
    
}
