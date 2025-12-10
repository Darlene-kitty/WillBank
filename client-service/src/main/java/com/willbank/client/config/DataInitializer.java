package com.willbank.client.config;

import com.willbank.client.entity.Client;
import com.willbank.client.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Initialise les données par défaut au démarrage de l'application
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createDefaultAdminIfNotExists();
    }

    /**
     * Crée un administrateur par défaut si la table clients est vide
     */
    private void createDefaultAdminIfNotExists() {
        long clientCount = clientRepository.count();
        
        if (clientCount == 0) {
            log.info("No clients found in database. Creating default admin...");
            
            Client admin = new Client();
            admin.setFirstName("Will");
            admin.setLastName("Kungne");
            admin.setEmail("admin@willbank.com");
            admin.setPassword(passwordEncoder.encode("ADMIN1234"));
            admin.setPhone("+33123456789");
            admin.setAddress("1 Avenue des Banques, 75001 Paris");
            admin.setCin("ADMIN001");
            admin.setFcmToken("6w088Q-tg6lOvFDlIM81GxI7oFXGZvczzNs2O8aHYA8");
            admin.setRole(Client.ClientRole.ADMIN);
            admin.setStatus(Client.ClientStatus.ACTIVE);
            
            clientRepository.save(admin);
            
            log.info("✅ Default admin created successfully:");
            log.info("   - Email: admin@willbank.com");
            log.info("   - Password: ADMIN1234");
            log.info("   - Role: ADMIN");
            log.info("   - CIN: ADMIN001");
        } else {
            log.info("Clients already exist in database. Skipping default admin creation.");
        }
    }
}
