package com.example.demo.ServiceTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.entity.Client;
import com.repository.ClientRepository;
import com.service.ClientService;

import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
public class ClientServiceTest {
    
    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
     private ClientService clientService;

     @Test
     public void ClientService_CreateClient_ReturnSavedClient(){
        //ARRANGE
        String clientName = "Connie Cardoso";
        String clientEmail = "connieclient@test.com";
        String clientAcc = "A1234";
        String clientNumber = "0825695478";

        Client client = new Client();
        client.setClientName(clientName);
        client.setEmail(clientEmail);
        client.setAccountNumber(clientAcc);
        client.setPhoneNumber(clientNumber);

        when(clientRepository.findByEmail(clientEmail)).thenReturn(Optional.empty());
        when(clientRepository.save(any(Client.class))).thenReturn(client);

        //ACT
        Client newClient = clientService.createClient(clientName, clientEmail, clientAcc, clientNumber);

        //ASSERT
        assertNotNull(newClient);
        assertEquals(clientName, newClient.getClientName());
        assertEquals(clientEmail, newClient.getEmail());
        assertEquals(clientNumber, newClient.getPhoneNumber());
        assertEquals(clientAcc, newClient.getAccountNumber());

        //VERIFY
        verify(clientRepository).findByEmail(clientEmail);
        verify(clientRepository).save(any(Client.class));
    }
}
