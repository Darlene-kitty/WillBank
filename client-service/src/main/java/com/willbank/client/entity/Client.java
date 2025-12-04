package com.willbank.client.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "clients", indexes = {
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_phone", columnList = "phone")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = false)
    private String address;
    
    @Column(nullable = false, unique = true)
    private String cin;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClientRole role = ClientRole.CLIENT;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClientStatus status = ClientStatus.ACTIVE;
    
    private LocalDateTime lastLogin;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (role == null) {
            role = ClientRole.CLIENT;
        }
        if (status == null) {
            status = ClientStatus.ACTIVE;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum ClientRole {
        CLIENT,
        ADMIN,
        AGENT
    }
    
    public enum ClientStatus {
        ACTIVE,
        BLOCKED,
        PENDING,
        SUSPENDED
    }
}
