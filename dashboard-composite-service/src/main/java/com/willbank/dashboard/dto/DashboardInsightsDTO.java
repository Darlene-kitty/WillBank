package com.willbank.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardInsightsDTO {
    private String spendingTrend; // "INCREASING", "DECREASING", "STABLE"
    private BigDecimal monthlyGrowthPercentage;
    private String topSpendingCategory;
    private BigDecimal averageMonthlyBalance;
    private List<String> recommendations;
    private List<AlertDTO> alerts;
    private GoalProgressDTO goalProgress;
}