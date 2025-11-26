package com.willbank.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private ClientDTO client;
    private List<AccountDTO> accounts;
    private List<TransactionDTO> recentTransactions;
}
