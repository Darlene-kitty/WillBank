package com.willbank.client.controller;

import com.willbank.client.dto.ClientDTO;
import com.willbank.client.service.ClientService;
import io.swagger.v3.oas.annotations.Hidden;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Internal controller for service-to-service communication
 * These endpoints don't require authentication and should only be used by other microservices
 */
@RestController
@RequestMapping("/internal/clients")
@RequiredArgsConstructor
@Hidden // Hide from Swagger documentation
public class InternalClientController {
    
    private final ClientService clientService;
    
    @GetMapping("/{id}")
    public ResponseEntity<ClientDTO> getClientById(@PathVariable("id") Long id) {
        ClientDTO client = clientService.getClientById(id);
        return ResponseEntity.ok(client);
    }
}