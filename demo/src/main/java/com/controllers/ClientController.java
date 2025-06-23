package com.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.entity.Client;
import com.entity.User;
import com.repository.ClientRepository;
import com.repository.UserRepository;
import com.service.ClientService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


//cpntroller receives post request to api/clients and sends it to client service
@RestController
@RequestMapping("/api/clients") //base url for all client API endpoints
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"}) //Allows CORS if using live server frontend
public class ClientController {
    
    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ClientService clientService;

    @Autowired
    private UserRepository userRepository;

    //API endpoint to create new client
    //Accepts JSON data via POST request + delegates to the service
    @PostMapping
    public ResponseEntity<Client> createClient(@RequestBody Client client) {
        Client saved = clientService.createClient(
            client.getClientName(),
            client.getEmail(),
            client.getAccountNumber(),
            client.getPhoneNumber()
            );
            return ResponseEntity.ok(saved);
    }

    //API endpoint to get all clients
    @GetMapping
    public List<Client> getAllClients() {
        return clientService.getAllClients();
    }

    //code for getting clients linked to their logged in user
    @GetMapping("/user")
    public ResponseEntity<List<Client>> getClientForLoggedInUser(
        @AuthenticationPrincipal Jwt jwt) {
        
            String username = jwt.getSubject();

            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

            List<Client> clients = clientRepository.findClientsByProjectManager(user);
        return ResponseEntity.ok(clients);
    }
    
    
    
}
