package com.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.dto.AuthenticationRequestDto;
import com.dto.AuthenticationResponseDto;
import com.entity.Role;
import com.entity.User;
import com.repository.RoleRepository;
import com.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    public AuthenticationResponseDto authenticate(
        final AuthenticationRequestDto request)   {

            var authToken = UsernamePasswordAuthenticationToken
            .unauthenticated(request.username(), request.password());

            var authentication = authenticationManager
                .authenticate(authToken);

            //fetch user from db
            User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            //List<Role> roles = user.getRole();

            String token = jwtService.generateToken(request.username(), user.getDashboardType(), user.getRole());
            return new AuthenticationResponseDto(token, user.getDashboardType());
         }  

}
