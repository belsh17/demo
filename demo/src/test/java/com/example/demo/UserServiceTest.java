// //unit test for UserSerice class tests registerUser and authenticate
// //Using JUnit 5 for testing and Mockito to mock dependencies like UserRep. & PassEnco
// package com.example.demo;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.junit.jupiter.api.Assertions.assertFalse;
// import static org.junit.jupiter.api.Assertions.assertTrue;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.times;
// import static org.mockito.Mockito.verify;
// import static org.mockito.Mockito.when;

// import java.util.Optional;

// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;

// import com.entity.User;
// import com.repository.UserRepository;
// import com.service.UserService;

// @Service
// public class UserServiceTest {

//     //tells Mockito to create fake (mock) objects - dont use real ones
//     @Mock
//     private UserRepository userRepository;


//     @Mock
//     private PasswordEncoder passwordEncoder;

//     //Creates real instance UserService, but injects mocked repository and encoder not real ones
//     @InjectMocks
//     private UserService userService;

//     //initializes Mockito so mocks can work properly before ea test run
//     public UserServiceTest(){
//         MockitoAnnotations.openMocks(this);
//     }

//     //test case 1
//     @Test
//     void testRegisterUser(){
//         User user = new User();
//         user.setUsername("john");
//         user.setPassword("plainPassword");

//         System.out.println("Step 1: Created user");
//         //Fake behaviour of the encoder
//         when(passwordEncoder.encode("plainPassword")).thenReturn("hashedPassword");
//         System.out.println("Step 2: Mocked passwordEncoder");
//         //fake saving user in the repo. - return same user back
//         when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);
//         System.out.println("Step 3: Mocked userRepository.save");
//         // call method we testing
//         User savedUser = userService.registerUser(user);
//         System.out.println("Step 4: Called registerUser");
//         //check pass. was hashed (test assertion)
//         assertEquals("hashedPassword", savedUser.getPassword());
//         System.out.println("Step 5: Assertion passed");
//         //Check that save was called once
//         try{
//             //verify(userRepository, times(1)).save(any(User.class));
//             verify(userRepository).save(any(User.class));
//             System.out.println("Step 6: Verify passed");
//             System.out.println("Save method was called successfully.");
//         }catch (Throwable e){
//             System.out.println("Save method was NOT called.");
//             e.printStackTrace();
//         }
        
//     }

//     //test case 2
//     @Test
//     void testAuthenticateSuccess(){
//         //simulate saved user with hashed password
//         User user = new User();
//         user.setUsername("john");
//         user.setPassword("hashedPassword");
//         //tell reposit to "find" the user
//         when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
//         //simulate pass. entered matches hashed password
//         when(passwordEncoder.matches("plainPassword", "hashedPassword")).thenReturn(true);
        
//         Optional<User> result = userService.authenticate("john", "plainPassword");
//         //check that the result is present (test assertion)
//         assertTrue(result.isPresent());

//         System.out.println("User Found: " + userRepository.findByUsername("john"));
//         System.out.println("Password matches: " + passwordEncoder.matches("plainPassword", "hashedPassword"));
//     }

//     @Test
//     void testAuthenticateFailure(){
//         //simulate no user is found
//         when(userRepository.findByUsername("wrong")).thenReturn(Optional.empty());

//         Optional<User> result = userService.authenticate("wrong", "pass");
//         //(test assertion)
//         assertFalse(result.isPresent());
//     }
// }
