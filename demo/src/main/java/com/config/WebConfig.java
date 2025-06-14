//Enable CORS cross origin resource sharing 
//by default web browsers block requests from 1 origin to another i.e. frontend 5500 and backend 8080
package com.config;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{

    // @Bean
    // public WebMvcConfigurer corsConfig(){
    //     return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry){
            registry.addMapping("/**")
                .allowedOrigins("http://127.0.0.1:5500", "http://localhost:5500")
                //.allowedMethods("GET","POST","PUT","DELETE", "OPTIONS")
                .allowedMethods("GET","POST","DELETE","OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
           }

           public void addViewControllers(ViewControllerRegistry registry) {
		        registry.addViewController("/templates").setViewName("templatesHome");
                registry.addViewController("/construction").setViewName("construction");
                registry.addViewController("/projects").setViewName("projectsHome");
                registry.addViewController("/deadlines").setViewName("deadlines");
                registry.addViewController("/indivProjects").setViewName("oneProject");
                registry.addViewController("/createProject").setViewName("indivProject");
	}
    //     };
    // }
}




