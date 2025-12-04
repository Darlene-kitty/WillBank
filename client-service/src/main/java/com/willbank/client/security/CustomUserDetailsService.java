package com.willbank.client.security;

import com.willbank.client.entity.Client;
import com.willbank.client.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    
    private final ClientRepository clientRepository;
    
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Client not found with email: " + email));
        
        return new org.springframework.security.core.userdetails.User(
                client.getEmail(),
                client.getPassword(),
                client.getStatus() == Client.ClientStatus.ACTIVE,
                true,
                true,
                client.getStatus() != Client.ClientStatus.BLOCKED,
                getAuthorities(client)
        );
    }
    
    private Collection<? extends GrantedAuthority> getAuthorities(Client client) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + client.getRole().name()));
        return authorities;
    }
}
