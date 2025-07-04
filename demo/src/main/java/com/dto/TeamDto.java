package com.dto;

import java.time.LocalDate;
import java.util.List;

import com.entity.User;

public class TeamDto {
    private Long id;
    private String name;
    //private List<User> users;
    //  public TeamDto(Long id, String name, List<User> users) {
    //     this.id = id;
    //     this.name = name;
    //     this.users = users;
    // }
    //commented out top to test team list memebers for dash-more in team controller
    private List<UserTeamDto> users;

    public TeamDto(Long id, String name, List<UserTeamDto> users) {
        this.id = id;
        this.name = name;
        this.users = users;
    }
    //end of added more below

   
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

    public List<UserTeamDto> getUsers() {
        return users;
    }

    public void setUsers(List<UserTeamDto> users) {
        this.users = users;
    }
    
// public List<User> getUsers() {
//     return users;
// }

// public void setUsers(List<User> users) {
//     this.users = users;
// }
    
}
