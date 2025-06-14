package com.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import java.time.Duration;

import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.JwtProperties;
import com.entity.Role;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JwtService {
    
    // private final String issuer;

    // private final Duration ttl;

    private final JwtEncoder jwtEncoder;
    private final JwtProperties jwtProperties;

    //LOGIN WORKS WITH THE COMMMENTED OUT ONES
    public String generateToken(final String username, final String dashboardType, Role role){
    //public String generateToken(final String username, final String dashboardType){
        
    //ADDED TO TEST ADMIN - login also worked without this
    // List<String> roleNames = roles.stream()
    //     .map(Role::getRoleName)
    //     .collect(Collectors.toList());
    //END OF TEST
    
        final var claimsSet = JwtClaimsSet.builder()
            .subject(username)
            .issuer(jwtProperties.getIssuer())
            .expiresAt(Instant.now().plus(jwtProperties.getTtl()))
            .claim("dashboardType", dashboardType)
            //.claim("roles", roleName.getRoleName())
            //ADDED THE BOTTOM LINE AS TEST - LOGIN WORKED WITHOUT IT
            .claim("roles", role.getRoleName())
            .build();

            return jwtEncoder.encode(JwtEncoderParameters.from(claimsSet))
                .getTokenValue();
    }
}
