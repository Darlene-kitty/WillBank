package com.willbank.transaction.dto;

import com.willbank.transaction.entity.Transaction;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private Long id;
    private String transactionReference;
    
    @NotNull(message = "Transaction type is required")
    private Transaction.TransactionType type;
    
    @NotNull(message = "Source account ID is required")
    private Long sourceAccountId;
    
    private Long destinationAccountId;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    
    private String description;
    private Transaction.TransactionStatus status;
    private LocalDateTime createdAt;
}
