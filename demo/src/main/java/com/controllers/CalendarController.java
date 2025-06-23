package com.controllers;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.repository.GoogleTokensRepository;
import com.service.GoogleCalendarService;
import com.service.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;

import com.entity.GoogleTokens;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.calendar.Calendar;


@RestController
@RequestMapping("/calendar")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class CalendarController {

    private final GoogleTokensRepository googleTokensRepository;

    private final AdminController adminController;

    @Autowired
    private GoogleCalendarService calendarService;

    @Autowired
    private JwtUtil jwtUtil;

    CalendarController(AdminController adminController, GoogleTokensRepository googleTokensRepository) {
        this.adminController = adminController;
        this.googleTokensRepository = googleTokensRepository;
    }

    @GetMapping("/events")
    public List<Map<String, Object>> getEvents() throws IOException, GeneralSecurityException{
    //   try{  
        //var service = calendarService.getCalendarService();
        Calendar calendar = calendarService.getCalendarService();

        var events = calendar.events().list("primary")
            .setMaxResults(10)
            .setOrderBy("startTime")
            .setSingleEvents(true)
            .execute();

        List<Map<String, Object>> simplifiedEvents = new ArrayList<>();

        if(events.getItems() != null){
            for(var event : events.getItems()){
                Map<String, Object> map = new HashMap<>();
                map.put("summary", event.getSummary());
                map.put("start", event.getStart());
                map.put("end", event.getEnd());
                map.put("description", event.getDescription());
                simplifiedEvents.add(map);
            }
        }
        return simplifiedEvents;
    // }catch(IOException | GeneralSecurityException e){
    //     e.printStackTrace();
    //     //return List.status(500).body("Failed to fetch events:" + e.getMessage());
    // }
    }

    @GetMapping("/api/google/link")
    public ResponseEntity<String> getGoogleAuthUrl(
        @RequestHeader("Authorization") String authHeader
    ) {
        //extract jwt token from authorization header
            if(authHeader == null || !authHeader.startsWith("Bearer ")){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No JWT token provided");
            }

            String jwtToken = authHeader.substring(7); //remove bearer

            //URL - encode JWT token to safely pass it as state
            String encodedState = java.net.URLEncoder.encode(jwtToken, java.nio.charset.StandardCharsets.UTF_8);
           
            //client id from app for using o auth - identify my app to googles OAuth servers
            String clientId = "121171246684-ub0gl8368g7am3lp0p3aahtbiohn0uaq.apps.googleusercontent.com";
            String redirectUri = "http://localhost:8081/calendar/api/google/callback";
            
             //String redirectUri = "http://localhost:8081/login/oauth2/code/google";
            //build google OAuth URL with client Id...adminController
            String googleOAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth" + 
                                    "?client_id=" + clientId + 
                                    "&redirect_uri=" + redirectUri +
                                    "&response_type=code" + 
                                    "&scope=https://www.googleapis.com/auth/calendar.readonly" + 
                                    "&access_type=offline" +
                                    "&prompt=consent" + 
                                    "&state=" + encodedState;
        return ResponseEntity.ok(googleOAuthUrl);
    }


    //manually manage OAuth flow so that i can still use JWT tokens
    // @GetMapping("/api/google/link")
    // // public ResponseEntity<String> getGoogleAuthUrl(
    //     // Authentication authentication) {
    // public void redirectToGoogleOAuth(
    //     //@RequestParam("token") String jwtToken,
    //     @RequestHeader("Authorization") String authHeader,
    //     HttpServletResponse response) throws IOException {

        
    //         //extract jwt token from authorization header
    //         if(authHeader == null || !authHeader.startsWith("Bearer ")){
    //             response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "No JWT token provided");
    //             return;
    //         }

    //         String jwtToken = authHeader.substring(7); //remove bearer

    //         //client id from app for using o auth - identify my app to googles OAuth servers
    //         String clientId = "121171246684-ub0gl8368g7am3lp0p3aahtbiohn0uaq.apps.googleusercontent.com";
    //         String redirectUri = "http://localhost:8081/calendar/api/google/callback";
            
    //         //URL - encode JWT token to safely pass it as state
    //         String encodedState = java.net.URLEncoder.encode(jwtToken, java.nio.charset.StandardCharsets.UTF_8);
    //         //String redirectUri = "http://localhost:8081/login/oauth2/code/google";
    //         //build google OAuth URL with client Id...adminController
    //         String googleOAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth" + 
    //                                 "?client_id=" + clientId + 
    //                                 "&redirect_uri=" + redirectUri +
    //                                 "&response_type=code" + 
    //                                 "&scope=https://www.googleapis.com/auth/calendar.readonly" + 
    //                                 "&access_type=offline" +
    //                                 "&prompt=consent" + 
    //                                 "&state=" + encodedState;
    //     response.sendRedirect(googleOAuthUrl);
    // }

    //exchange received code for Google tokens using Google OAuth client
    //save these tokens linked to authenticated user of App
    //after saving tokens redirect to frontend of my app
    @GetMapping("/api/google/callback")
    public ResponseEntity<?> handleGoogleCallback(
        @RequestParam String code,
        @RequestParam String state) throws IOException {
        // Authentication authentication) throws IOException {

        String username;
        try{
            username = jwtUtil.extractUsername(state);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid JWT in state");
        }

            String clientId = "121171246684-ub0gl8368g7am3lp0p3aahtbiohn0uaq.apps.googleusercontent.com";
            String clientSecret = "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";
            String redirectUri = "http://localhost:8081/calendar/api/google/callback";
            //String redirectUri = "http://localhost:8081/login/oauth2/code/google";

            //exchange authorization code for tokens using google OAuth client library:
            GoogleTokenResponse tokenResponse = new GoogleAuthorizationCodeTokenRequest(
                new NetHttpTransport(), 
                GsonFactory.getDefaultInstance(), 
                clientId, 
                clientSecret, 
                code, 
                redirectUri)
            .execute();

            String accessToken = tokenResponse.getAccessToken();
            String refreshToken = tokenResponse.getRefreshToken();
            Instant expiry = tokenResponse.getExpiresInSeconds() != null ? 
                Instant.now().plusSeconds(tokenResponse.getExpiresInSeconds()) :
                null;
            //have to save tokens in databse linked to user
            // String username = authentication.getName();

            GoogleTokens tokens = new GoogleTokens(username, accessToken, refreshToken, expiry);
            googleTokensRepository.save(tokens);

        return ResponseEntity.status(HttpStatus.FOUND)
            .header(HttpHeaders.LOCATION, "http://localhost:8081/calendar?linked=true")
            //use the above line when serving backend 8081 with thymeleaf - use below line for testing using 5500
            //.header(HttpHeaders.LOCATION, "http://127.0.0.1:5500/calendar?linked=true")
            .build();
    }
    
    
}
