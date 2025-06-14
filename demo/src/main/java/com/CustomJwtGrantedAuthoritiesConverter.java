package com;

import org.springframework.boot.autoconfigure.task.TaskExecutionProperties.Simple;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

//spring security automatically makes roles with prefix ROLE_ so my ADMIN wont match so wont authorize the user to see certain permissions
public class CustomJwtGrantedAuthoritiesConverter implements Converter<Jwt, Collection<GrantedAuthority>>{
    
    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt){
        //extract roles from JWT claim 
        String roles = jwt.getClaimAsString("roles");

        if(roles == null || roles.isEmpty()){
            return List.of();
        }

        //add ROLE_ prefix if missing
        // return roles.stream()
        //     .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
        //     .map(SimpleGrantedAuthority::new)
        //     .collect(Collectors.toList());
        String formattedRole = roles.startsWith("ROLE_") ? roles : "ROLE_" + roles;

        return List.of(new SimpleGrantedAuthority(formattedRole));
    }
}
