package com.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entity.Client;
import com.repository.ClientRepository;

//client service checks if client with same name exists...
@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    //This method creates a new client only if a client with the same name doesn't already exist
    //checks for existing client by name and saves new one if not found
    public Client createClient(String clientName, String email, String accountNumber, String phoneNumber){
                return clientRepository.findByEmail(email)
                    .orElseGet(() -> {
                        Client newClient = new Client();
                        newClient.setClientName(clientName);
                        newClient.setEmail(email);
                        newClient.setAccountNumber(accountNumber);
                        newClient.setPhoneNumber(phoneNumber);
                        return clientRepository.save(newClient);

                    });
            }

    public List<Client> getAllClients(){
        return clientRepository.findAll();
    }
}