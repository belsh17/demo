package com.repository;

import java.util.List;
import java.util.Optional;
import com.entity.Client;
import com.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
//extends JpaRepository to provide CRUD operations
//Includes custom method to find client by name
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

//spring uses feature = Query Method Parsing- reads method name and auto. creates the correct SQL/HQL query based on the entity
//repo using jpa gives you basic CRUD methods like (findAll(), save(), deleteById(), findById())
public interface ClientRepository extends JpaRepository<Client, Long>{
    //custom query method: find a client by thier name
    Optional<Client> findByClientName(String clientName);
    Optional<Client> findByEmail(String email);
    //List<Client> findByProjectManager(User user);

    //sleects clients from the project where the manager is a user
    @Query("SELECT DISTINCT p.client FROM Project p WHERE p.projectManager = :user")
    List<Client> findClientsByProjectManager(@Param("user") User user);
}
