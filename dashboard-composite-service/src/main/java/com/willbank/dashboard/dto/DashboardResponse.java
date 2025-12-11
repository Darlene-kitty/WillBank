package com.willbank.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private ClientDTO client;
    private List<AccountDTO> accounts;
    private List<TransactionDTO> recentTransactions;
    
    // Nouvelles données enrichies
    private BigDecimal totalBalance;
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpenses;
    private BigDecimal savingsRate;
    private Map<String, BigDecimal> transactionsByType;
    private List<BalanceHistoryDTO> balanceHistory;
    private DashboardInsightsDTO insights;
    private LocalDateTime lastUpdated;
}
