package com.willbank.account.dto;

import com.willbank.account.entity.Account;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {
    private Long id;
    private String accountNumber;
    
    @NotNull(message = "Client ID is required")
    private Long clientId;
    
    @NotNull(message = "Account type is required")
    private Account.AccountType accountType;
    
    private BigDecimal balance;
    private Account.AccountStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
