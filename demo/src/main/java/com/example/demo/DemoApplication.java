package com.example.demo;

import com.entity.Role;
import com.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import com.repository.RoleRepository;
import com.repository.UserRepository;

@SpringBootApplication(scanBasePackages = {"com"})
@EnableJpaRepositories("com.repository")
@EnableMethodSecurity
@EntityScan("com.entity")
public class DemoApplication {

    private final RoleRepository roleRepository;

	@Autowired
	private UserRepository userRepository;

    DemoApplication(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
		
	}

	@Configuration
	@EnableJpaAuditing
	public class JpaConfig {
		//configuration for Jpa auditing for auto. timestamping
	}


}
