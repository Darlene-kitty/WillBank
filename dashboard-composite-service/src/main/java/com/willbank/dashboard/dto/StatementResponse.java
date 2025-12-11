package com.willbank.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatementResponse {
    private AccountDTO account;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<TransactionDTO> transactions;
}
