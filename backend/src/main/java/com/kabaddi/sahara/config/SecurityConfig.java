package com.kabaddi.sahara.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) { this.jwtAuthFilter = jwtAuthFilter; }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public: achievements, photos, static uploads, auth login
                .requestMatchers("/api/achievements/**", "/api/photos/**", "/uploads/**", "/api/auth/login", "/api/auth/logout", "/h2-console/**").permitAll()
                // Admin-only: create/update/delete (photo list under achievements is public read)
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/achievements/**").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/achievements/**").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/achievements/**").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/achievements/*/photos").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/photos/**").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/photos/**").authenticated()
                .anyRequest().denyAll())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
}
