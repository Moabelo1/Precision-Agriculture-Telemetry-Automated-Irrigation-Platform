package com.agritech.auth.controller;

import com.agritech.auth.dto.AuthResponse;
import com.agritech.auth.dto.LoginRequest;
import com.agritech.auth.dto.RegisterRequest;
import com.agritech.auth.dto.TokenValidationResponse;
import com.agritech.auth.entity.Role;
import com.agritech.auth.entity.User;
import com.agritech.auth.repository.UserRepository;
import com.agritech.auth.security.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: Email " + request.getEmail() + " is already registered.");
        }

        Role userRole = request.getRole() != null ? request.getRole() : Role.ROLE_FARMER;
        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                userRole
        );
        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole());

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new AuthResponse(token, savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole(), "User registered successfully")
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
        }

        User user = userOpt.get();
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getFullName(), user.getRole());

        return ResponseEntity.ok(
                new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole(), "Login successful")
        );
    }

    @GetMapping("/validate")
    public ResponseEntity<TokenValidationResponse> validateToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new TokenValidationResponse(false, null, null, null));
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new TokenValidationResponse(false, null, null, null));
        }

        Claims claims = jwtUtil.extractAllClaims(token);
        Long userId = claims.get("userId", Long.class);
        String email = claims.getSubject();
        String role = (String) claims.get("role");

        return ResponseEntity.ok(new TokenValidationResponse(true, userId, email, role));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
