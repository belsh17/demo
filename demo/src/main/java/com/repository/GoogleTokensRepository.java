package com.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.entity.GoogleTokens;
import java.util.List;


public interface GoogleTokensRepository extends JpaRepository<GoogleTokens, Long>{
    GoogleTokens findByUsername(String username);
}
