package com.willbank.client.repository;

import com.willbank.client.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByEmail(String email);
    Optional<Client> findByCin(String cin);
    boolean existsByEmail(String email);
    boolean existsByCin(String cin);
}
