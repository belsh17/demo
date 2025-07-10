package com.service;


import java.util.Collections;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JpaUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    //method to load users by username
    @Override
    public UserDetails loadUserByUsername(final String username) 
      throws UsernameNotFoundException {

        //finds user by username
        return userRepository.findByUsername(username).map(user ->
        //gives user permissions according to the role
                User.builder()
                        .username(username)
                        .password(user.getPassword())
                        .authorities(Collections.singleton(
                          new SimpleGrantedAuthority("ROLE_" + user.getRole().getRoleName())
                        ))
                        .build()
        ).orElseThrow(() -> new UsernameNotFoundException(
            "User with username [%s] not found".formatted(username)));
    }

}

