package com.willbank.dashboard.controller;

import com.willbank.dashboard.dto.DashboardResponse;
import com.willbank.dashboard.dto.StatementResponse;
import com.willbank.dashboard.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
@Tag(name = "Dashboard Composite", description = "Composite APIs for dashboard and statements")
public class DashboardController {
    
    private final DashboardService dashboardService;
    
    @GetMapping("/dashboard/{clientId}")
    @Operation(
        summary = "Get client dashboard", 
        description = "Retrieves complete dashboard with client info, all accounts, and 10 most recent transactions"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Dashboard retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Client not found")
    })
    public ResponseEntity<DashboardResponse> getDashboard(@PathVariable("clientId") Long clientId) {
        DashboardResponse dashboard = dashboardService.getDashboard(clientId);
        return ResponseEntity.ok(dashboard);
    }
    
    @GetMapping("/statements/{accountId}")
    @Operation(
        summary = "Get account statement", 
        description = "Retrieves account statement with all transactions within the specified date range"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Statement retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Account not found")
    })
    public ResponseEntity<StatementResponse> getAccountStatement(
            @PathVariable("accountId") Long accountId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        StatementResponse statement = dashboardService.getAccountStatement(accountId, from, to);
        return ResponseEntity.ok(statement);
    }
}
