package com.entity;

import java.util.Set;

import jakarta.persistence.*;

@Entity
@Table(name = "userTeams")
public class UserTeams {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String teamRole;

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private User user;

    @ManyToMany
    @JoinTable(
        name = "user_team", 
        joinColumns = @JoinColumn(name = "user_teams_id"),
        inverseJoinColumns = @JoinColumn(name = "team_id")
        )

    private Set<Team> teams;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTeamRole() {
        return teamRole;
    }

    public void setTeamRole(String teamRole) {
        this.teamRole = teamRole;
    }

    public Set<Team> getTeams() {
        return teams;
    }

    public void setTeams(Set<Team> teams) {
        this.teams = teams;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
    
    
}
