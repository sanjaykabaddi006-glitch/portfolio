package com.kabaddi.sahara.controller;

import com.kabaddi.sahara.model.AdminUser;
import com.kabaddi.sahara.repository.AdminUserRepository;
import com.kabaddi.sahara.service.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    public record LoginRequest(@NotBlank String username, @NotBlank String password) {}

    private final AdminUserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(AdminUserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        return users.findByUsername(req.username())
                .filter(u -> encoder.matches(req.password(), u.getPasswordHash()))
                .map(u -> ResponseEntity.ok(Map.of("token", jwt.generateToken(u.getUsername()), "username", u.getUsername())))
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Invalid username or password")));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Stateless JWT: client discards token. Provided for API completeness.
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }
}
