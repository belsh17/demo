package com.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

import com.CustomJwtGrantedAuthoritiesConverter;
import com.service.JpaUserDetailsService;

import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;

//import com.service.CustomUserDetailsService;

//config. tells Spring this class contains security related config.
@Configuration
@EnableWebSecurity
public class SecurityConfig{

    @Autowired
    private JpaUserDetailsService userDetailsService;

    @Autowired
    private AuthenticationConfiguration authenticationConfiguration;


    @Bean DaoAuthenticationProvider authProvider(){
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    //defines password encoder bean, uses BCrypt - strong 1 way hashing algo.
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    //Main security filter chain - defines all web sec. rules
    //Bean - create object once and reuse it
    @Bean
    public SecurityFilterChain securityFilterChain(
        final HttpSecurity http
        ) throws Exception {
        return http
        //.cors(Customizer.withDefaults())
        //disables CSRF protection (Cross Site Request Forgery)
        //okay to disable for APIs (App. Prog. Interface) 
        //Spring exposes APIs so that other software (frontend/mobile app) can send HTTP requests to it
        //.csrf(csrf -> csrf.disable())
        .csrf(AbstractHttpConfigurer::disable)
        //authorize requests based on their route + HTTP method
        .authorizeHttpRequests(auth -> auth
        //whitelisting
        //allows public access to "/api/auth/" like login and sign up
        //Allow OPTIONS requests for all their routes(CORS pre-flight)
            .requestMatchers(HttpMethod.OPTIONS, 
                        "/**"
            ).permitAll()
            //public POST routes - login,signup, registration etc.
            .requestMatchers(HttpMethod.POST,
                        "/api/users/login",
                        "/api/users/signup",
                        "/api/clients",
                        "/api/auth/register",
                        "/api/projects"
            ).permitAll()
            //Public GET routes - login,calendar events...
            .requestMatchers(HttpMethod.GET, 
                        // "/calendar/events",
                        "/signup",
                        "/login",
                        "/oauth2/**",
                        "/api/defaultDashboard",
                        "/api/customizableDashboard.html",
                        "/calendar/api/google/link",
                        "/calendar/api/google/callback"
            ).permitAll()
            // .requestMatchers(HttpMethod.PUT,
            //             "/api/admin/users/**"
            // ).permitAll() //CHANGE WHEN ADMIN ROLE IS BACK TO hasRole("ADMIN")
            .requestMatchers(HttpMethod.PUT,
                        "/api/admin/users/**",
                                    "/api/admin/users/{id}/role"
            ).hasRole("ADMIN")
            //admin-only routes - must have ROLE_ADMIN
            .requestMatchers(
                "/api/admin/**",
                            "/api/admin/users"
                            // "/api/projects/user"
            ).hasRole("ADMIN")
            //static assests and other public paths
            .requestMatchers(
                        "/CSS/**",
                        "/script/**",
                        "/assets/**",
                        "/calendar",
                        // "/calender/events",
                        // "/api/**",
                        "/calendar/events",
                        "/api/auth/**",
                        "/api/auth/register",
                        "/api/auth/login",
                        "/webjars/**",
                        "/indivProject",
                        "/api/clients",
                        "/client",
                        "/api/files/upload",
                        "/login",
                        "/api/dashboard/test",
                        "/defaultDashboard.html",
                        "/customizableDashboard.html",
                        "/api/users/project-managers",
                        "/api/projects/**",
                        "/api/projects/deadlines",
                        "/api/users",
                        "/api/projects/{id}/teams",
                        "/api/files/**",
                        "/api/teams/users",
                        "/api/projects/user",
                        "/api/user-templates/save",
                        "/api/notifications/user",
                        "/api/projects/deadlines/user",
                        "/oauth2/",
                        "/login/oauth2/**",
                        "/calendar/api/google/**",
                        "/calendar/api/google/callback"
                        //"/api/admin/**"

            ).permitAll()
            //secures all other routes
            //COMMMENTED OUT FOR TESTING
            .anyRequest().authenticated()
            //allow unrestricted access for all routes
            //.anyRequest().permitAll()
        )

        .sessionManagement(session -> 
              session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        //signup WAS WORKING WITH THIS block COMMMENTED OUT
                //.oauth2ResourceServer(server -> server
        //         .oauth2ResourceServer(oauth2 -> oauth2
        //           .jwt(Customizer.withDefaults())
        //           .authenticationEntryPoint(
        //               new BearerTokenAuthenticationEntryPoint())
        //           .accessDeniedHandler(
        //               new BearerTokenAccessDeniedHandler())
        //   )
        //NORMALLY USE THE ABOVE ONE - TESTING ANOTHER CONFIG FOR ADMIN
            .oauth2ResourceServer(oauth2 -> {
                JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
                jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new CustomJwtGrantedAuthoritiesConverter());
            
                oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter))
                    .authenticationEntryPoint(new BearerTokenAuthenticationEntryPoint())
                    .accessDeniedHandler(new BearerTokenAccessDeniedHandler());
            })
        //END OF TESTING 

        //commented out while testing pages
        // .oauth2Login(oauth2 -> oauth2
        //     //ADDING THIS CODE SO IT STILL USES JWT
        //     .successHandler((request, response, authentication) -> {
        //         //redirect to frontend - do not create session auth
        //         response.sendRedirect("http://localhost:8081/calendar?linked=true");
        //     })
        //     //END OF USING JWT STILL
        //     //.loginPage("/oauth2/authorization/google")
        //     //.defaultSuccessUrl("/calendar?linked=true", true)
        // )

        //commmented out while testing
        // .logout(logout -> logout
        //     .logoutSuccessUrl("/")
        //     .permitAll()
        // )
        //enables Spring Secuirty default login page
        //.formLogin(form -> form.disable());
            //.loginPage("/login").permitAll()
        
    .build();
    }

    //manually authenticate users
    @Bean
    public AuthenticationManager authenticationManager(
        final AuthenticationConfiguration authenticationConfiguration)
        throws Exception {
            return authenticationConfiguration.getAuthenticationManager();
        }
}

// JWTs (JSON Web Tokens) are compact, 
// self-contained tokens that securely transmit information as a JSON object.