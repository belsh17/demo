package com;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class AuthUtils {
    public static String getAuthenticatedUsername(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth != null && auth.isAuthenticated()){
            Object principal = auth.getPrincipal();
            if(principal instanceof UserDetails userDetails){
                return userDetails.getUsername();
            }else if(principal instanceof String username){
                return username;
            }
        }
        return null;
    }
}
