package com.repository;

import java.util.Optional;
import com.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
//extends JpaRepository to provide CRUD operations
//Includes custom method to find client by name
public interface ClientRepository extends JpaRepository<Client, Long>{
    //custom query method: find a client by thier name
    Optional<Client> findByClientName(String clientName);
    Optional<Client> findByEmail(String email);
}
