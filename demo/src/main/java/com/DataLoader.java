package com;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.entity.Role;
import com.repository.RoleRepository;

@Component
public class DataLoader implements CommandLineRunner{
    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args){
        if(roleRepository.count() == 0){
            roleRepository.save(new Role("ADMIN"));
            roleRepository.save(new Role("USER"));
            roleRepository.save(new Role("PROJECT_MANAGER"));
        }
    }

}
