package com.service;

import java.io.IOException;

import java.security.GeneralSecurityException;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.stereotype.Service;

import com.entity.GoogleTokens;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.UserCredentials;
import com.repository.GoogleTokensRepository;

@Service
public class GoogleCalendarService {

    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;

    @Autowired
    private AuthenticationFacade authenticationFacade;

    @Autowired 
    private GoogleTokensRepository tokenRepository;

    public Calendar getCalendarService() throws IOException, GeneralSecurityException {
        String username = authenticationFacade.getAuthentication().getName();
        //OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient("google", username);
        //GoogleTokens tokens = tokenRepository.findByUsername(username);
        //commmneted out above line to test list for tokens
        //creates token list 
        List<GoogleTokens> tokensList = tokenRepository.findByUsername(username);
       
        //if the list is null then throws error message
        if(tokensList == null) {
            throw new RuntimeException("No google tokens linked for user");
        }

        //ADDED THIS BOTTOM CODE TO TEST TOKENS LIST
        GoogleTokens tokens = tokensList.get(0);
        //END OF ADDED

        //gets the token expiry date from the topken
        Instant expiryInstant = tokens.getExpiryDate();
        Date expiryDate = expiryInstant != null ? Date.from(expiryInstant) : null;

        //creates access token 
        AccessToken accessToken = new AccessToken(tokens.getAccessToken(), expiryDate);
        //creates user credentials accpording to the account created on google api 
        UserCredentials userCredentials = UserCredentials.newBuilder()
            .setClientId("121171246684-ub0gl8368g7am3lp0p3aahtbiohn0uaq.apps.googleusercontent.com") 
            .setClientSecret("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")
            .setRefreshToken(tokens.getRefreshToken())
            .setAccessToken(accessToken)
            .build();

            //builds calendar
        return new Calendar.Builder(
            GoogleNetHttpTransport.newTrustedTransport(), 
            com.google.api.client.json.gson.GsonFactory.getDefaultInstance(),
            new HttpCredentialsAdapter(userCredentials)
            )
        .setApplicationName("Plan-Nest")
        .build();
      
    }
}
  // if(client == null){
        //     throw new RuntimeException("No OAuth2 client found for user " + username);

        // }
        //  String tokenValue = client.getAccessToken().getTokenValue();
        //  java.util.Date tokenExpiry = java.sql.Timestamp.from(client.getAccessToken().getExpiresAt());
        // // GoogleCredential credential = new GoogleCredential().setAccessToken(accessToken);

        // return new Calendar.Builder(
        //     GoogleNetHttpTransport.newTrustedTransport(),
        //     JacksonFactory.getDefaultInstance(),
        //     credential)
        //     .setApplicationName("Plan-Nest")
        //     .build();

        // InputStream in = getClass().getResourceAsStream("/credentials.json");
        // if(in == null) {
        //     throw new IOException("Resource not found: credentials.json");
        // }

        // GoogleCredentials credentials = GoogleCredentials.fromStream(in)
        // //     .createScoped(List.of(CalendarScopes.CALENDAR));

        // AccessToken accessToken = new AccessToken(tokenValue, tokenExpiry);
        // GoogleCredentials credentials = GoogleCredentials.create(accessToken)
        //      .createScoped(Collections.singleton(CalendarScopes.CALENDAR));
        // @SuppressWarnings("deprecation")
        // JacksonFactory jacksonFactory = JacksonFactory.getDefaultInstance();

        // return new Calendar.Builder(
        //     GoogleNetHttpTransport.newTrustedTransport(),
        //     jacksonFactory,
        //     new HttpCredentialsAdapter(credentials))
        //     .setApplicationName("Plan-Nest")
        //     .build();