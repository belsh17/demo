package com.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.entity.Project;
import com.entity.User;
import com.entity.UserTemplates;

public interface UserTemplatesRepository extends JpaRepository<UserTemplates, Long>{
    List<UserTemplates> findByUser(User user);
    List<UserTemplates> findByUserAndProject(User user, Project project);
}
