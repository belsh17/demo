package com.controllers;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.service.GoogleCalendarService;
import com.google.api.services.calendar.Calendar;

@RestController
@RequestMapping("/calendar")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class CalendarController {

    @Autowired
    private GoogleCalendarService calendarService;

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
}
