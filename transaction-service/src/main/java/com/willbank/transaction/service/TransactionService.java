package com.willbank.transaction.service;

import com.willbank.transaction.client.AccountClient;
import com.willbank.transaction.dto.TransactionDTO;
import com.willbank.transaction.entity.Transaction;
import com.willbank.transaction.event.AccountCreditedEvent;
import com.willbank.transaction.event.AccountDebitedEvent;
import com.willbank.transaction.event.TransactionCreatedEvent;
import com.willbank.transaction.exception.TransactionNotFoundException;
import com.willbank.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {
    
    private final TransactionRepository transactionRepository;
    private final AccountClient accountClient;
    private final EventPublisher eventPublisher;
    
    @Transactional
    public TransactionDTO createTransaction(TransactionDTO transactionDTO) {
        log.info("Creating transaction: {}", transactionDTO);
        
        Transaction transaction = toEntity(transactionDTO);
        transaction.setTransactionReference(generateTransactionReference());
        transaction.setStatus(Transaction.TransactionStatus.PENDING);
        
        try {
            // Execute transaction based on type
            switch (transaction.getType()) {
                case DEPOSIT:
                    accountClient.credit(transaction.getSourceAccountId(), transaction.getAmount());
                    eventPublisher.publishAccountCredited(new AccountCreditedEvent(
                        transaction.getSourceAccountId(),
                        transaction.getAmount(),
                        transaction.getTransactionReference(),
                        LocalDateTime.now()
                    ));
                    break;
                    
                case WITHDRAWAL:
                    accountClient.debit(transaction.getSourceAccountId(), transaction.getAmount());
                    eventPublisher.publishAccountDebited(new AccountDebitedEvent(
                        transaction.getSourceAccountId(),
                        transaction.getAmount(),
                        transaction.getTransactionReference(),
                        LocalDateTime.now()
                    ));
                    break;
                    
                case TRANSFER:
                    accountClient.debit(transaction.getSourceAccountId(), transaction.getAmount());
                    accountClient.credit(transaction.getDestinationAccountId(), transaction.getAmount());
                    eventPublisher.publishAccountDebited(new AccountDebitedEvent(
                        transaction.getSourceAccountId(),
                        transaction.getAmount(),
                        transaction.getTransactionReference(),
                        LocalDateTime.now()
                    ));
                    eventPublisher.publishAccountCredited(new AccountCreditedEvent(
                        transaction.getDestinationAccountId(),
                        transaction.getAmount(),
                        transaction.getTransactionReference(),
                        LocalDateTime.now()
                    ));
                    break;
            }
            
            transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
            Transaction savedTransaction = transactionRepository.save(transaction);
            
            // Publish transaction created event
            eventPublisher.publishTransactionCreated(new TransactionCreatedEvent(
                savedTransaction.getId(),
                savedTransaction.getTransactionReference(),
                savedTransaction.getType(),
                savedTransaction.getSourceAccountId(),
                savedTransaction.getDestinationAccountId(),
                savedTransaction.getAmount(),
                savedTransaction.getDescription(),
                savedTransaction.getCreatedAt()
            ));
            
            log.info("Transaction created successfully: {}", savedTransaction.getTransactionReference());
            return toDTO(savedTransaction);
            
        } catch (Exception e) {
            log.error("Transaction failed: {}", e.getMessage());
            transaction.setStatus(Transaction.TransactionStatus.FAILED);
            transactionRepository.save(transaction);
            throw e;
        }
    }
    
    public TransactionDTO getTransactionById(Long id) {
        log.info("Fetching transaction with ID: {}", id);
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found with ID: " + id));
        return toDTO(transaction);
    }
    
    public TransactionDTO getTransactionByReference(String reference) {
        log.info("Fetching transaction with reference: {}", reference);
        Transaction transaction = transactionRepository.findByTransactionReference(reference)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found with reference: " + reference));
        return toDTO(transaction);
    }
    
    public List<TransactionDTO> getTransactionsByAccountId(Long accountId) {
        log.info("Fetching transactions for account ID: {}", accountId);
        return transactionRepository.findByAccountId(accountId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<TransactionDTO> getTransactionsByAccountIdAndDateRange(Long accountId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Fetching transactions for account ID {} between {} and {}", accountId, startDate, endDate);
        return transactionRepository.findBySourceAccountIdAndDateRange(accountId, startDate, endDate).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<TransactionDTO> getAllTransactions() {
        log.info("Fetching all transactions");
        return transactionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    private String generateTransactionReference() {
        String reference;
        do {
            reference = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (transactionRepository.existsByTransactionReference(reference));
        return reference;
    }
    
    private TransactionDTO toDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setTransactionReference(transaction.getTransactionReference());
        dto.setType(transaction.getType());
        dto.setSourceAccountId(transaction.getSourceAccountId());
        dto.setDestinationAccountId(transaction.getDestinationAccountId());
        dto.setAmount(transaction.getAmount());
        dto.setDescription(transaction.getDescription());
        dto.setStatus(transaction.getStatus());
        dto.setCreatedAt(transaction.getCreatedAt());
        return dto;
    }
    
    private Transaction toEntity(TransactionDTO dto) {
        Transaction transaction = new Transaction();
        transaction.setType(dto.getType());
        transaction.setSourceAccountId(dto.getSourceAccountId());
        transaction.setDestinationAccountId(dto.getDestinationAccountId());
        transaction.setAmount(dto.getAmount());
        transaction.setDescription(dto.getDescription());
        return transaction;
    }
}
