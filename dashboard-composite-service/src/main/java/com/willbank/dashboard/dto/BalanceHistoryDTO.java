package com.willbank.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BalanceHistoryDTO {
    private LocalDate date;
    private BigDecimal balance;
    private String period; // "daily", "weekly", "monthly"
}