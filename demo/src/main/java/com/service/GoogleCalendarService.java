package com.service;

import java.io.IOException;

import java.security.GeneralSecurityException;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;

@Service
public class GoogleCalendarService {

    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;

    @Autowired
    private AuthenticationFacade authenticationFacade;

    public Calendar getCalendarService() throws IOException, GeneralSecurityException {
        String username = authenticationFacade.getAuthentication().getName();
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient("google", username);
        
        if(client == null){
            throw new RuntimeException("No OAuth2 client found for user " + username);

        }
         String tokenValue = client.getAccessToken().getTokenValue();
         java.util.Date tokenExpiry = java.sql.Timestamp.from(client.getAccessToken().getExpiresAt());
        // GoogleCredential credential = new GoogleCredential().setAccessToken(accessToken);

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
        //     .createScoped(List.of(CalendarScopes.CALENDAR));

        AccessToken accessToken = new AccessToken(tokenValue, tokenExpiry);
        GoogleCredentials credentials = GoogleCredentials.create(accessToken)
             .createScoped(Collections.singleton(CalendarScopes.CALENDAR));
        @SuppressWarnings("deprecation")
        JacksonFactory jacksonFactory = JacksonFactory.getDefaultInstance();

        return new Calendar.Builder(
            GoogleNetHttpTransport.newTrustedTransport(),
            jacksonFactory,
            new HttpCredentialsAdapter(credentials))
            .setApplicationName("Plan-Nest")
            .build();
    }
}
