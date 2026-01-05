package com.example.learning.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // This maps the URL path to your physical file location
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:./uploads/");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // This specifically allows your frontend to access these files
        registry.addMapping("/api/uploads/**")
                .allowedOrigins("http://journey.crabdance.com", "http://localhost:8080") // Replace with your frontend
                                                                                         // domain
                .allowedMethods("GET", "OPTIONS")
                .allowedHeaders("*");
    }
}
