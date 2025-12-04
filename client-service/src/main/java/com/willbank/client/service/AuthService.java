package com.willbank.client.service;

import com.willbank.client.dto.*;
import com.willbank.client.entity.Client;
import com.willbank.client.exception.ClientAlreadyExistsException;
import com.willbank.client.exception.InvalidCredentialsException;
import com.willbank.client.exception.InvalidTokenException;
import com.willbank.client.repository.ClientRepository;
import com.willbank.client.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    
    @Transactional
    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            Client client = clientRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));
            
            // Update last login
            client.setLastLogin(LocalDateTime.now());
            clientRepository.save(client);
            
            String accessToken = jwtUtil.generateToken(userDetails);
            String refreshToken = jwtUtil.generateRefreshToken(userDetails);
            
            log.info("Login successful for email: {}", request.getEmail());
            
            return LoginResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtUtil.getJwtExpiration())
                    .client(convertToDTO(client))
                    .build();
                    
        } catch (Exception e) {
            log.error("Login failed for email: {}", request.getEmail(), e);
            throw new InvalidCredentialsException("Invalid email or password");
        }
    }
    
    @Transactional
    public LoginResponse register(RegisterRequest request) {
        log.info("Registration attempt for email: {}", request.getEmail());
        
        if (clientRepository.existsByEmail(request.getEmail())) {
            throw new ClientAlreadyExistsException("Client with email " + request.getEmail() + " already exists");
        }
        
        if (clientRepository.existsByCin(request.getCin())) {
            throw new ClientAlreadyExistsException("Client with CIN " + request.getCin() + " already exists");
        }
        
        Client client = new Client();
        client.setFirstName(request.getFirstName());
        client.setLastName(request.getLastName());
        client.setEmail(request.getEmail());
        client.setPassword(passwordEncoder.encode(request.getPassword()));
        client.setPhone(request.getPhone());
        client.setAddress(request.getAddress());
        client.setCin(request.getCin());
        client.setRole(Client.ClientRole.CLIENT);
        client.setStatus(Client.ClientStatus.ACTIVE);
        client.setLastLogin(LocalDateTime.now());
        
        Client savedClient = clientRepository.save(client);
        log.info("Client registered successfully with ID: {}", savedClient.getId());
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedClient.getEmail());
        String accessToken = jwtUtil.generateToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);
        
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getJwtExpiration())
                .client(convertToDTO(savedClient))
                .build();
    }
    
    public LoginResponse refreshToken(RefreshTokenRequest request) {
        log.info("Refresh token request");
        
        try {
            String email = jwtUtil.extractUsername(request.getRefreshToken());
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            
            if (!jwtUtil.isTokenValid(request.getRefreshToken(), userDetails)) {
                throw new InvalidTokenException("Invalid refresh token");
            }
            
            Client client = clientRepository.findByEmail(email)
                    .orElseThrow(() -> new InvalidTokenException("Client not found"));
            
            String accessToken = jwtUtil.generateToken(userDetails);
            String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);
            
            log.info("Token refreshed successfully for email: {}", email);
            
            return LoginResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(newRefreshToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtUtil.getJwtExpiration())
                    .client(convertToDTO(client))
                    .build();
                    
        } catch (Exception e) {
            log.error("Failed to refresh token", e);
            throw new InvalidTokenException("Invalid refresh token");
        }
    }
    
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        log.info("Change password request for email: {}", email);
        
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Client not found"));
        
        if (!passwordEncoder.matches(request.getCurrentPassword(), client.getPassword())) {
            throw new InvalidCredentialsException("Current password is incorrect");
        }
        
        client.setPassword(passwordEncoder.encode(request.getNewPassword()));
        clientRepository.save(client);
        
        log.info("Password changed successfully for email: {}", email);
    }
    
    private ClientDTO convertToDTO(Client client) {
        ClientDTO dto = new ClientDTO();
        dto.setId(client.getId());
        dto.setFirstName(client.getFirstName());
        dto.setLastName(client.getLastName());
        dto.setEmail(client.getEmail());
        dto.setPhone(client.getPhone());
        dto.setAddress(client.getAddress());
        dto.setCin(client.getCin());
        dto.setRole(client.getRole());
        dto.setStatus(client.getStatus());
        dto.setLastLogin(client.getLastLogin());
        dto.setCreatedAt(client.getCreatedAt());
        dto.setUpdatedAt(client.getUpdatedAt());
        return dto;
    }
}
