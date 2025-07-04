package com.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.entity.GoogleTokens;
import java.util.List;


public interface GoogleTokensRepository extends JpaRepository<GoogleTokens, Long>{
    //GoogleTokens findByUsername(String username);
    //commented out top to test List
    List<GoogleTokens> findByUsername(String username);
}
