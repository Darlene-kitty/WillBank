package com.willbank.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoalProgressDTO {
    private BigDecimal totalSavingsGoal;
    private BigDecimal currentSavings;
    private BigDecimal monthlyTarget;
    private BigDecimal progressPercentage;
    private LocalDate targetDate;
    private String status; // "ON_TRACK", "BEHIND", "AHEAD"
}