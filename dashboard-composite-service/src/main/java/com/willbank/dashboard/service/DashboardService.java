package com.willbank.dashboard.service;

import com.willbank.dashboard.client.AccountServiceClient;
import com.willbank.dashboard.client.ClientServiceClient;
import com.willbank.dashboard.client.TransactionServiceClient;
import com.willbank.dashboard.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {
    
    private final ClientServiceClient clientServiceClient;
    private final AccountServiceClient accountServiceClient;
    private final TransactionServiceClient transactionServiceClient;
    private final DashboardAnalyticsService analyticsService;
    
    public DashboardResponse getDashboard(Long clientId) {
        log.info("Fetching dashboard for client ID: {}", clientId);
        
        // Fetch client information
        ClientDTO client = clientServiceClient.getClientById(clientId);
        log.info("Client fetched: {}", client.getEmail());
        
        // Fetch all accounts for the client
        List<AccountDTO> accounts = accountServiceClient.getAccountsByClientId(clientId);
        log.info("Found {} accounts for client", accounts.size());
        
        // Fetch recent transactions for all accounts (last 10)
        List<TransactionDTO> allTransactions = new ArrayList<>();
        for (AccountDTO account : accounts) {
            try {
                List<TransactionDTO> accountTransactions = transactionServiceClient.getTransactionsByAccountId(account.getId());
                allTransactions.addAll(accountTransactions);
            } catch (Exception e) {
                log.warn("Could not fetch transactions for account {}: {}", account.getId(), e.getMessage());
            }
        }
        
        // Sort by date and get last 10
        List<TransactionDTO> recentTransactions = allTransactions.stream()
                .sorted(Comparator.comparing(TransactionDTO::getCreatedAt).reversed())
                .limit(10)
                .collect(Collectors.toList());
        
        log.info("Fetched {} recent transactions", recentTransactions.size());
        
        // Calculs enrichis
        BigDecimal totalBalance = accounts.stream()
            .map(AccountDTO::getBalance)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal monthlyIncome = allTransactions.stream()
            .filter(t -> "DEPOSIT".equals(t.getType()))
            .map(TransactionDTO::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal monthlyExpenses = allTransactions.stream()
            .filter(t -> "WITHDRAWAL".equals(t.getType()) || "TRANSFER".equals(t.getType()))
            .map(TransactionDTO::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal savingsRate = analyticsService.calculateSavingsRate(monthlyIncome, monthlyExpenses);
        Map<String, BigDecimal> transactionsByType = analyticsService.calculateTransactionsByType(allTransactions);
        List<BalanceHistoryDTO> balanceHistory = analyticsService.generateBalanceHistory(accounts, allTransactions);
        DashboardInsightsDTO insights = analyticsService.generateInsights(accounts, allTransactions);
        
        DashboardResponse response = new DashboardResponse();
        response.setClient(client);
        response.setAccounts(accounts);
        response.setRecentTransactions(recentTransactions);
        response.setTotalBalance(totalBalance);
        response.setMonthlyIncome(monthlyIncome);
        response.setMonthlyExpenses(monthlyExpenses);
        response.setSavingsRate(savingsRate);
        response.setTransactionsByType(transactionsByType);
        response.setBalanceHistory(balanceHistory);
        response.setInsights(insights);
        response.setLastUpdated(LocalDateTime.now());
        
        log.info("Dashboard enriched with analytics data for client {}", clientId);
        
        return response;
    }
    
    public StatementResponse getAccountStatement(Long accountId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Fetching statement for account ID: {} from {} to {}", accountId, startDate, endDate);
        
        // Fetch account information
        AccountDTO account = accountServiceClient.getAccountById(accountId);
        log.info("Account fetched: {}", account.getAccountNumber());
        
        // Fetch transactions for the date range
        List<TransactionDTO> transactions = transactionServiceClient.getTransactionsByDateRange(accountId, startDate, endDate);
        log.info("Found {} transactions in the date range", transactions.size());
        
        StatementResponse response = new StatementResponse();
        response.setAccount(account);
        response.setStartDate(startDate);
        response.setEndDate(endDate);
        response.setTransactions(transactions);
        
        return response;
    }
}
