package com.agritech.auth.config;

import com.agritech.auth.entity.Role;
import com.agritech.auth.entity.User;
import com.agritech.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(new User(
                        "admin@agritech.com",
                        passwordEncoder.encode("admin123"),
                        "Sarah Jenkins (Chief Farm Administrator)",
                        Role.ROLE_ADMIN
                ));

                userRepository.save(new User(
                        "agronomist@agritech.com",
                        passwordEncoder.encode("agro123"),
                        "Dr. Robert Thorne (Senior Agronomist)",
                        Role.ROLE_AGRONOMIST
                ));

                userRepository.save(new User(
                        "farmer@agritech.com",
                        passwordEncoder.encode("farmer123"),
                        "John Miller (Regional Farmer)",
                        Role.ROLE_FARMER
                ));
            }
        };
    }
}
