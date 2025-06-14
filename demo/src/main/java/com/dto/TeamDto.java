package com.dto;

import java.time.LocalDate;
import java.util.List;

import com.entity.User;

public class TeamDto {
    private Long id;
    private String name;
    private List<User> users;

    

    public TeamDto(Long id, String name, List<User> users) {
        this.id = id;
        this.name = name;
        this.users = users;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    
public List<User> getUsers() {
    return users;
}

public void setUsers(List<User> users) {
    this.users = users;
}
    
}
