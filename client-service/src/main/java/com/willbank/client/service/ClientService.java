package com.willbank.client.service;

import com.willbank.client.dto.ClientDTO;
import com.willbank.client.entity.Client;
import com.willbank.client.exception.ClientAlreadyExistsException;
import com.willbank.client.exception.ClientNotFoundException;
import com.willbank.client.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClientService {
    
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Transactional
    public ClientDTO createClient(ClientDTO clientDTO) {
        log.info("Creating client with email: {}", clientDTO.getEmail());
        
        if (clientRepository.existsByEmail(clientDTO.getEmail())) {
            throw new ClientAlreadyExistsException("Client with email " + clientDTO.getEmail() + " already exists");
        }
        
        if (clientRepository.existsByCin(clientDTO.getCin())) {
            throw new ClientAlreadyExistsException("Client with CIN " + clientDTO.getCin() + " already exists");
        }
        
        Client client = toEntity(clientDTO);
        Client savedClient = clientRepository.save(client);
        log.info("Client created successfully with ID: {}", savedClient.getId());
        
        return toDTO(savedClient);
    }
    
    public ClientDTO getClientById(Long id) {
        log.info("Fetching client with ID: {}", id);
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ClientNotFoundException("Client not found with ID: " + id));
        return toDTO(client);
    }
    
    public ClientDTO getClientByEmail(String email) {
        log.info("Fetching client with email: {}", email);
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new ClientNotFoundException("Client not found with email: " + email));
        return toDTO(client);
    }
    
    public List<ClientDTO> getAllClients() {
        log.info("Fetching all clients");
        return clientRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ClientDTO updateClient(Long id, ClientDTO clientDTO) {
        log.info("Updating client with ID: {}", id);
        
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ClientNotFoundException("Client not found with ID: " + id));
        
        if (!client.getEmail().equals(clientDTO.getEmail()) && 
            clientRepository.existsByEmail(clientDTO.getEmail())) {
            throw new ClientAlreadyExistsException("Client with email " + clientDTO.getEmail() + " already exists");
        }
        
        client.setFirstName(clientDTO.getFirstName());
        client.setLastName(clientDTO.getLastName());
        client.setEmail(clientDTO.getEmail());
        client.setPhone(clientDTO.getPhone());
        client.setAddress(clientDTO.getAddress());
        client.setCin(clientDTO.getCin());
        
        if (clientDTO.getRole() != null) {
            client.setRole(clientDTO.getRole());
        }
        
        if (clientDTO.getStatus() != null) {
            client.setStatus(clientDTO.getStatus());
        }
        
        Client updatedClient = clientRepository.save(client);
        log.info("Client updated successfully with ID: {}", updatedClient.getId());
        
        return toDTO(updatedClient);
    }
    
    @Transactional
    public void deleteClient(Long id) {
        log.info("Deleting client with ID: {}", id);
        
        if (!clientRepository.existsById(id)) {
            throw new ClientNotFoundException("Client not found with ID: " + id);
        }
        
        clientRepository.deleteById(id);
        log.info("Client deleted successfully with ID: {}", id);
    }
    
    private ClientDTO toDTO(Client client) {
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
    
    private Client toEntity(ClientDTO dto) {
        Client client = new Client();
        client.setFirstName(dto.getFirstName());
        client.setLastName(dto.getLastName());
        client.setEmail(dto.getEmail());
        // Default password for admin-created clients
        client.setPassword(passwordEncoder.encode("DefaultPassword123!"));
        client.setPhone(dto.getPhone());
        client.setAddress(dto.getAddress());
        client.setCin(dto.getCin());
        client.setRole(dto.getRole() != null ? dto.getRole() : Client.ClientRole.CLIENT);
        client.setStatus(dto.getStatus() != null ? dto.getStatus() : Client.ClientStatus.ACTIVE);
        return client;
    }
}
