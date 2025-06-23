package com.example.demo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.entity.Role;
import com.entity.User;
import com.repository.RoleRepository;
import com.repository.UserRepository;
import com.service.AdminService;

@ExtendWith(MockitoExtension.class)
public class AdminUserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private AdminService adminService;

    @Test
    public void AdminService_GetUserByUsername_ReturnUser(){

        //arrange
        //String username = "katCar215";

        User mockUser = new User();
        mockUser.setUsername("katCar215");
        mockUser.setEmail("kat@example.com");
        
        when(userRepository.findByUsername("katCar215")).thenReturn(Optional.of(mockUser));
    
        //DEBUG
        Optional<User> check = userRepository.findByUsername("katCar215");
        System.out.println("Mocked value: " + check);
        //act
        User foundUser = adminService.getUserByUsername("katCar215");

        assertNotNull(foundUser);
        assertEquals("katCar215", foundUser.getUsername());
        assertEquals("kat@example.com", foundUser.getEmail());
    }
}
