package com.willbank.client.service;

import com.willbank.client.dto.ClientDTO;
import com.willbank.client.entity.Client;
import com.willbank.client.exception.ClientAlreadyExistsException;
import com.willbank.client.exception.ClientNotFoundException;
import com.willbank.client.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClientService {
    
    private final ClientRepository clientRepository;
    
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
        dto.setCreatedAt(client.getCreatedAt());
        dto.setUpdatedAt(client.getUpdatedAt());
        return dto;
    }
    
    private Client toEntity(ClientDTO dto) {
        Client client = new Client();
        client.setFirstName(dto.getFirstName());
        client.setLastName(dto.getLastName());
        client.setEmail(dto.getEmail());
        client.setPhone(dto.getPhone());
        client.setAddress(dto.getAddress());
        client.setCin(dto.getCin());
        return client;
    }
}
