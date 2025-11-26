package com.willbank.notification.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountCreditedEvent {
    private Long accountId;
    private BigDecimal amount;
    private String transactionReference;
    private LocalDateTime timestamp;
}
