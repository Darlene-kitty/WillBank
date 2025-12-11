package com.willbank.dashboard.client;

import com.willbank.dashboard.dto.TransactionDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;

@FeignClient(name = "transaction-service")
public interface TransactionServiceClient {
    
    @GetMapping("/api/transactions/account/{accountId}")
    List<TransactionDTO> getTransactionsByAccountId(@PathVariable("accountId") Long accountId);
    
    @GetMapping("/api/transactions/account/{accountId}/range")
    List<TransactionDTO> getTransactionsByDateRange(
        @PathVariable("accountId") Long accountId,
        @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
        @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    );
}
