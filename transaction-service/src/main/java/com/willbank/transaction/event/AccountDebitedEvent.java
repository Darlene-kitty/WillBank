package com.willbank.transaction.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDebitedEvent {
    private Long accountId;
    private BigDecimal amount;
    private String transactionReference;
    private LocalDateTime timestamp;
}
