package com.willbank.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlertDTO {
    private String type; // "LOW_BALANCE", "UNUSUAL_SPENDING", "GOAL_REMINDER"
    private String severity; // "INFO", "WARNING", "CRITICAL"
    private String title;
    private String message;
    private LocalDateTime createdAt;
    private boolean isRead;
}