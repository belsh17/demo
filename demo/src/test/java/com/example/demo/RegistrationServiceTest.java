package com.example.demo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.dto.RegistrationRequestDto;
import com.dto.RegistrationResponseDto;
import com.entity.Role;
import com.entity.User;
import com.repository.RoleRepository;
import com.repository.UserRepository;
import com.service.UserRegistrationService;

@ExtendWith(MockitoExtension.class)
public class RegistrationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserRegistrationService registrationService;

    @Test
    public void RegistrationService_registerUser_ReturnSavedUser(){
        //arrange
        String username = "katCar";
        String email = "kat@example.com";
        String rawPassword = "secure123";
        String encodedPassword = "encodedPassword123";
        String dashboardType = "default";
        String fullName = "Katarina Cardoso";
        //String mockedToken = "mockedToken123";

        Role userRole = new Role();
        userRole.setRoleName("USER");
        //roleRepository.save(userRole);

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(rawPassword);
        user.setDashboardType(dashboardType);
        user.setFullName(fullName);
        //user.setRole(userRole);

        //mocking behaviour
        when(userRepository.existsByUsername(username)).thenReturn(false);
        when(userRepository.existsByEmail(email)).thenReturn(false);
        when(userRepository.count()).thenReturn(1L);
        when(roleRepository.findByRoleName("USER")).thenReturn(Optional.of(userRole));
        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);

        //mock save to return user with role and encoded password
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setRole(userRole);
            return u;
        });

        //act
        User registeredUser = registrationService.registerUser(user);

        //assert
        assertNotNull(registeredUser);
        assertEquals(username, registeredUser.getUsername());
        assertEquals(encodedPassword, registeredUser.getPassword());
        assertEquals(userRole.getRoleName(), registeredUser.getRole().getRoleName());
        
        //verify
        verify(userRepository).existsByUsername(username);
        verify(userRepository).existsByEmail(email);
        verify(roleRepository).findByRoleName("USER");
        verify(passwordEncoder).encode(rawPassword);
        verify(userRepository).save(any(User.class));
    }

}
