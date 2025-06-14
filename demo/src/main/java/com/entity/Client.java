package com.entity;


import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
@Table(name = "clients")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String clientName;

    @Column
    private String email;

    @Column
    private String accountNumber;

    @Column
    private String phoneNumber;

     @OneToMany(mappedBy = "client")
    private List<Project> projects;

    public Client(){}

    

    public Client(Long id, String clientName, String email, String accountNumber, String phoneNumber,
            List<Project> projects) {
        this.id = id;
        this.clientName = clientName;
        this.email = email;
        this.accountNumber = accountNumber;
        this.phoneNumber = phoneNumber;
        this.projects = projects;
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    
}
