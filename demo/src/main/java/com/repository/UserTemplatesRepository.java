package com.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.entity.UserTemplates;

public interface UserTemplatesRepository extends JpaRepository<UserTemplates, Long>{
    
}
