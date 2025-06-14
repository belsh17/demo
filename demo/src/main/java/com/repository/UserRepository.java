package com.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import com.entity.Client;
import com.entity.User;
import java.util.List;

//Repository for User entity and primary key is of type long hence <User, Long>
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    //query method, Spring Data JPA automatically implements it
    //translates to SELECT * FROM users WHERE username = ?;
   List<User> findByRoleRoleName(String roleName);
   Optional<User> findByUsername(String username);
   Optional<User> findByFullName(String fullName);
   boolean existsByUsername(String username);
   boolean existsByEmail(String email);
}