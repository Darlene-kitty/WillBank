package com.willbank.transaction.repository;

import com.willbank.transaction.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByTransactionReference(String transactionReference);
    List<Transaction> findBySourceAccountIdOrderByCreatedAtDesc(Long sourceAccountId);
    List<Transaction> findByDestinationAccountIdOrderByCreatedAtDesc(Long destinationAccountId);
    
    @Query("SELECT t FROM Transaction t WHERE (t.sourceAccountId = :accountId OR t.destinationAccountId = :accountId) ORDER BY t.createdAt DESC")
    List<Transaction> findByAccountId(Long accountId);
    
    @Query("SELECT t FROM Transaction t WHERE t.sourceAccountId = :accountId AND t.createdAt BETWEEN :startDate AND :endDate ORDER BY t.createdAt DESC")
    List<Transaction> findBySourceAccountIdAndDateRange(Long accountId, LocalDateTime startDate, LocalDateTime endDate);
    
    boolean existsByTransactionReference(String transactionReference);
}
