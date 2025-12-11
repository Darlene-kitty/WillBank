package com.willbank.account.service;

import com.willbank.account.client.ClientClient;
import com.willbank.account.dto.AccountDTO;
import com.willbank.account.dto.ClientDTO;
import com.willbank.account.entity.Account;
import com.willbank.account.exception.AccountNotFoundException;
import com.willbank.account.exception.InsufficientBalanceException;
import com.willbank.account.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService {
    
    private final AccountRepository accountRepository;
    private final ClientClient clientClient;
    private final EmailService emailService;
    private final Random random = new Random();
    
    @Transactional
    public AccountDTO createAccount(AccountDTO accountDTO) {
        log.info("Creating account for client ID: {}", accountDTO.getClientId());
        
        Account account = toEntity(accountDTO);
        account.setAccountNumber(generateAccountNumber());
        account.setBalance(BigDecimal.ZERO);
        account.setStatus(Account.AccountStatus.ACTIVE);
        
        Account savedAccount = accountRepository.save(account);
        log.info("Account created successfully with number: {}", savedAccount.getAccountNumber());
        
        // Send email notification to the client
        try {
            ClientDTO client = clientClient.getClientById(savedAccount.getClientId());
            emailService.sendAccountCreatedEmail(
                client.getEmail(),
                client.getFirstName(),
                client.getLastName(),
                savedAccount.getAccountNumber(),
                savedAccount.getAccountType().toString()
            );
        } catch (Exception e) {
            log.error("Failed to send account creation email: {}", e.getMessage());
            // Don't fail the account creation if email fails
        }
        
        return toDTO(savedAccount);
    }
    
    @Cacheable(value = "accounts", key = "#id")
    public AccountDTO getAccountById(Long id) {
        log.info("Fetching account with ID: {}", id);
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + id));
        return toDTO(account);
    }
    
    public AccountDTO getAccountByNumber(String accountNumber) {
        log.info("Fetching account with number: {}", accountNumber);
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with number: " + accountNumber));
        return toDTO(account);
    }
    
    public List<AccountDTO> getAccountsByClientId(Long clientId) {
        log.info("Fetching accounts for client ID: {}", clientId);
        return accountRepository.findByClientId(clientId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<AccountDTO> getAllAccounts() {
        log.info("Fetching all accounts");
        return accountRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    @CacheEvict(value = "accounts", key = "#id")
    public AccountDTO updateAccount(Long id, AccountDTO accountDTO) {
        log.info("Updating account with ID: {}", id);
        
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + id));
        
        account.setAccountType(accountDTO.getAccountType());
        account.setStatus(accountDTO.getStatus());
        
        Account updatedAccount = accountRepository.save(account);
        log.info("Account updated successfully with ID: {}", updatedAccount.getId());
        
        return toDTO(updatedAccount);
    }
    
    @Transactional
    @CacheEvict(value = "accounts", key = "#accountId")
    public void credit(Long accountId, BigDecimal amount) {
        log.info("Crediting account ID {} with amount: {}", accountId, amount);
        
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + accountId));
        
        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);
        
        log.info("Account credited successfully. New balance: {}", account.getBalance());
    }
    
    @Transactional
    @CacheEvict(value = "accounts", key = "#accountId")
    public void debit(Long accountId, BigDecimal amount) {
        log.info("Debiting account ID {} with amount: {}", accountId, amount);
        
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + accountId));
        
        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance in account: " + accountId);
        }
        
        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);
        
        log.info("Account debited successfully. New balance: {}", account.getBalance());
    }
    
    @Cacheable(value = "balances", key = "#accountId")
    public BigDecimal getBalance(Long accountId) {
        log.info("Fetching balance for account ID: {}", accountId);
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + accountId));
        return account.getBalance();
    }
    
    @Transactional
    @CacheEvict(value = "accounts", key = "#id")
    public void deleteAccount(Long id) {
        log.info("Deleting account with ID: {}", id);
        
        if (!accountRepository.existsById(id)) {
            throw new AccountNotFoundException("Account not found with ID: " + id);
        }
        
        accountRepository.deleteById(id);
        log.info("Account deleted successfully with ID: {}", id);
    }
    
    private String generateAccountNumber() {
        String accountNumber;
        do {
            accountNumber = String.format("WB%010d", random.nextInt(1000000000));
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }
    
    private AccountDTO toDTO(Account account) {
        AccountDTO dto = new AccountDTO();
        dto.setId(account.getId());
        dto.setAccountNumber(account.getAccountNumber());
        dto.setClientId(account.getClientId());
        dto.setAccountType(account.getAccountType());
        dto.setBalance(account.getBalance());
        dto.setStatus(account.getStatus());
        dto.setCreatedAt(account.getCreatedAt());
        dto.setUpdatedAt(account.getUpdatedAt());
        return dto;
    }
    
    private Account toEntity(AccountDTO dto) {
        Account account = new Account();
        account.setClientId(dto.getClientId());
        account.setAccountType(dto.getAccountType());
        return account;
    }
}
