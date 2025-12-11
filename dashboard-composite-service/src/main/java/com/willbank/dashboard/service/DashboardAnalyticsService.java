package com.willbank.dashboard.service;

import com.willbank.dashboard.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardAnalyticsService {

    public DashboardInsightsDTO generateInsights(List<AccountDTO> accounts, 
                                               List<TransactionDTO> transactions) {
        DashboardInsightsDTO insights = new DashboardInsightsDTO();
        
        // Calcul des tendances de dépenses
        insights.setSpendingTrend(calculateSpendingTrend(transactions));
        insights.setMonthlyGrowthPercentage(calculateMonthlyGrowth(transactions));
        insights.setTopSpendingCategory(findTopSpendingCategory(transactions));
        insights.setAverageMonthlyBalance(calculateAverageBalance(accounts));
        
        // Génération des recommandations
        insights.setRecommendations(generateRecommendations(accounts, transactions));
        
        // Génération des alertes
        insights.setAlerts(generateAlerts(accounts, transactions));
        
        // Progression des objectifs (simulée pour l'exemple)
        insights.setGoalProgress(generateGoalProgress());
        
        return insights;
    }

    public List<BalanceHistoryDTO> generateBalanceHistory(List<AccountDTO> accounts, 
                                                        List<TransactionDTO> transactions) {
        List<BalanceHistoryDTO> history = new ArrayList<>();
        
        // Simulation de l'historique des 7 derniers jours
        LocalDate today = LocalDate.now();
        BigDecimal currentTotal = accounts.stream()
            .map(AccountDTO::getBalance)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            // Simulation d'une variation aléatoire
            BigDecimal variation = currentTotal.multiply(BigDecimal.valueOf(Math.random() * 0.02 - 0.01));
            BigDecimal balance = currentTotal.add(variation);
            
            history.add(new BalanceHistoryDTO(date, balance, "daily"));
        }
        
        return history;
    }

    public Map<String, BigDecimal> calculateTransactionsByType(List<TransactionDTO> transactions) {
        return transactions.stream()
            .collect(Collectors.groupingBy(
                TransactionDTO::getType,
                Collectors.reducing(BigDecimal.ZERO, 
                    TransactionDTO::getAmount, 
                    BigDecimal::add)
            ));
    }

    public BigDecimal calculateSavingsRate(BigDecimal income, BigDecimal expenses) {
        if (income.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal savings = income.subtract(expenses);
        return savings.divide(income, 4, RoundingMode.HALF_UP)
                     .multiply(BigDecimal.valueOf(100));
    }

    private String calculateSpendingTrend(List<TransactionDTO> transactions) {
        // Logique simplifiée pour calculer la tendance
        long withdrawals = transactions.stream()
            .filter(t -> "WITHDRAWAL".equals(t.getType()))
            .count();
        
        long deposits = transactions.stream()
            .filter(t -> "DEPOSIT".equals(t.getType()))
            .count();
        
        if (withdrawals > deposits * 1.5) {
            return "INCREASING";
        } else if (deposits > withdrawals * 1.5) {
            return "DECREASING";
        }
        return "STABLE";
    }

    private BigDecimal calculateMonthlyGrowth(List<TransactionDTO> transactions) {
        // Simulation d'une croissance mensuelle
        return BigDecimal.valueOf(12.5);
    }

    private String findTopSpendingCategory(List<TransactionDTO> transactions) {
        // Pour l'exemple, retourner une catégorie fixe
        return "Alimentation";
    }

    private BigDecimal calculateAverageBalance(List<AccountDTO> accounts) {
        if (accounts.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal total = accounts.stream()
            .map(AccountDTO::getBalance)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return total.divide(BigDecimal.valueOf(accounts.size()), 2, RoundingMode.HALF_UP);
    }

    private List<String> generateRecommendations(List<AccountDTO> accounts, 
                                               List<TransactionDTO> transactions) {
        List<String> recommendations = new ArrayList<>();
        
        // Vérifier les soldes faibles
        long lowBalanceAccounts = accounts.stream()
            .filter(a -> a.getBalance().compareTo(BigDecimal.valueOf(1000)) < 0)
            .count();
        
        if (lowBalanceAccounts > 0) {
            recommendations.add("Considérez alimenter vos comptes avec un solde faible");
        }
        
        // Vérifier l'épargne
        BigDecimal totalBalance = accounts.stream()
            .map(AccountDTO::getBalance)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        if (totalBalance.compareTo(BigDecimal.valueOf(10000)) > 0) {
            recommendations.add("Excellent ! Pensez à diversifier vos placements");
        }
        
        recommendations.add("Configurez des virements automatiques pour épargner régulièrement");
        
        return recommendations;
    }

    private List<AlertDTO> generateAlerts(List<AccountDTO> accounts, 
                                        List<TransactionDTO> transactions) {
        List<AlertDTO> alerts = new ArrayList<>();
        
        // Alerte solde faible
        accounts.stream()
            .filter(a -> a.getBalance().compareTo(BigDecimal.valueOf(500)) < 0)
            .forEach(account -> {
                AlertDTO alert = new AlertDTO();
                alert.setType("LOW_BALANCE");
                alert.setSeverity("WARNING");
                alert.setTitle("Solde faible");
                alert.setMessage("Le compte " + account.getAccountNumber() + " a un solde faible");
                alert.setCreatedAt(LocalDateTime.now());
                alert.setRead(false);
                alerts.add(alert);
            });
        
        // Alerte dépenses inhabituelles
        BigDecimal totalWithdrawals = transactions.stream()
            .filter(t -> "WITHDRAWAL".equals(t.getType()))
            .map(TransactionDTO::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        if (totalWithdrawals.compareTo(BigDecimal.valueOf(5000)) > 0) {
            AlertDTO alert = new AlertDTO();
            alert.setType("UNUSUAL_SPENDING");
            alert.setSeverity("INFO");
            alert.setTitle("Dépenses élevées");
            alert.setMessage("Vos dépenses ce mois sont plus élevées que d'habitude");
            alert.setCreatedAt(LocalDateTime.now());
            alert.setRead(false);
            alerts.add(alert);
        }
        
        return alerts;
    }

    private GoalProgressDTO generateGoalProgress() {
        GoalProgressDTO progress = new GoalProgressDTO();
        progress.setTotalSavingsGoal(BigDecimal.valueOf(50000));
        progress.setCurrentSavings(BigDecimal.valueOf(17000));
        progress.setMonthlyTarget(BigDecimal.valueOf(2500));
        progress.setProgressPercentage(BigDecimal.valueOf(34));
        progress.setTargetDate(LocalDate.of(2024, 12, 31));
        progress.setStatus("ON_TRACK");
        
        return progress;
    }
}