package com.example.demo;

import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.entity.User;
import com.entity.Role;
import com.repository.RoleRepository;
import com.repository.UserRepository;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Test
    public void UserRepository_SaveAll_ReturnSavedUser(){

        //arrange
        User user = new User();
        user.setUsername("belshCar17");
        user.setEmail("bella@example.com");
        user.setPassword("puppies17");
        user.setFullName("Bella Cardoso");
        user.setDashboardType("default");

        //act
        User savedUser = userRepository.save(user);

        //assert
        Assertions.assertThat(savedUser).isNotNull();
        Assertions.assertThat(savedUser.getId()).isNotNull();
    }

    @Test
    public void UserRepository_GetAll_ReturnMoreThanOneUser(){

        userRepository.deleteAll();
        //arrange

        Role userRole = new Role();
        userRole.setRoleName("USER");
        roleRepository.save(userRole);

         Role pmRole = new Role();
        userRole.setRoleName("PROJECT_MANAGER");
        roleRepository.save(pmRole);

        User user = new User();
        user.setUsername("katCar30");
        user.setEmail("kat@example.com");
        user.setPassword("marshy30");
        user.setFullName("Katarina Cardoso");
        user.setDashboardType("default");
        user.setRole(pmRole);

        User user2 = new User();
        user2.setUsername("carlaCar27");
        user2.setEmail("carla@example.com");
        user2.setPassword("chico27");
        user2.setFullName("Carla Cardoso");
        user2.setDashboardType("default");
        user2.setRole(userRole);

        //act
        userRepository.save(user);
        userRepository.save(user2);

        //testing findall from repository
        List<User> listUsers = userRepository.findAll();

        //assert
        Assertions.assertThat(listUsers).isNotNull();
        Assertions.assertThat(listUsers.size()).isEqualTo(2);
    }

    @Test
    public void UserRepository_FindByUsername_ReturnsUser(){

        userRepository.deleteAll();
        //arrange
        User user = new User();
        user.setUsername("bellaCar17");
        user.setEmail("bellatest@example.com");
        user.setPassword("puppy17");
        user.setFullName("Isabella Cardoso");
        user.setDashboardType("default");
        //act
        userRepository.save(user);

        User userReturn = userRepository.findByUsername(user.getUsername()).get();

        //assert
        Assertions.assertThat(userReturn).isNotNull();
        Assertions.assertThat(userReturn.getUsername()).isEqualTo("bellaCar17");
    }

    @Test
    public void UserRepository_FindByFullName_ReturnsUser(){

        userRepository.deleteAll();
        //arrange
        User user = new User();
        user.setUsername("bellaCar17");
        user.setEmail("bellatest@example.com");
        user.setPassword("puppy17");
        user.setFullName("Isabella Cardoso");
        user.setDashboardType("default");
        //act
        userRepository.save(user);

        User userReturn = userRepository.findByFullName(user.getFullName()).get();

        //assert
        Assertions.assertThat(userReturn).isNotNull();
        Assertions.assertThat(userReturn.getFullName()).isEqualTo("Isabella Cardoso");
    }

    @Test
    public void UserRepository_FindByRoleRoleName_ReturnsUserByRole(){

        userRepository.deleteAll();
        roleRepository.deleteAll();
        //arrange
        Role userRole = new Role();
        userRole.setRoleName("USER");
        roleRepository.save(userRole);

        User user = new User();
        user.setUsername("bellaCar17");
        user.setEmail("bellatest@example.com");
        user.setPassword("puppy17");
        user.setFullName("Isabella Cardoso");
        user.setDashboardType("default");
        user.setRole(userRole);

        //act
        userRepository.save(user);

        List<User> usersWithRole = userRepository.findByRoleRoleName("USER");

        //assert
        Assertions.assertThat(usersWithRole).isNotNull();
        Assertions.assertThat(usersWithRole).isNotEmpty();
        Assertions.assertThat(usersWithRole.get(0).getRole().getRoleName()).isEqualTo("USER");
        
   
    }

}
