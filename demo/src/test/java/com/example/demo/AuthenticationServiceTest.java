package com.example.demo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import com.dto.AuthenticationRequestDto;
import com.dto.AuthenticationResponseDto;
import com.entity.Role;
import com.entity.User;
import com.repository.RoleRepository;
import com.repository.UserRepository;
import com.service.AuthenticationService;
import com.service.JwtService;

@ExtendWith(MockitoExtension.class)
public class AuthenticationServiceTest {

    @Mock 
    private AuthenticationManager authenticationManager;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthenticationService authenticationService;

    @Test
    public void AuthenticationService_authenticateUser_ReturnAuthenResponse(){

        //arrange
        String username = "katCar";
        String password = "secure123";
        String dashboardType = "default";
        String mockedToken = "mockedToken123";

        Role userRole = new Role();
        userRole.setRoleName("USER");
        roleRepository.save(userRole);

        User user = new User();
        user.setUsername(username);
        user.setEmail(password);
        user.setPassword(password);
        user.setDashboardType(dashboardType);
        user.setRole(userRole);
        
        //userRepository.save(user);

        AuthenticationRequestDto requestDto = new AuthenticationRequestDto(username, password);
        
        //mock authentification manager
        when(authenticationManager.authenticate(any()))
            .thenReturn(new UsernamePasswordAuthenticationToken(username, password, List.of()));

        //mock behaviour
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(jwtService.generateToken(username, dashboardType, userRole)).thenReturn(mockedToken);

        UsernamePasswordAuthenticationToken authToken = UsernamePasswordAuthenticationToken.unauthenticated(username, password);
        when(authenticationManager.authenticate(authToken))
            .thenReturn(UsernamePasswordAuthenticationToken.authenticated(username, password, List.of()));

        //act
        AuthenticationResponseDto response = authenticationService.authenticate(requestDto);

        //assert - check actual result
        assertNotNull(response);
        assertEquals(mockedToken, response.token());
        assertEquals(dashboardType, response.dashboardType());

        //verify - confirm certain interactions with mocks
        verify(authenticationManager).authenticate(any());
        verify(userRepository).findByUsername(username);
        verify(jwtService).generateToken(username, dashboardType, userRole);

    }

}
