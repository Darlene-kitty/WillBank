package com.willbank.transaction.controller;

import com.willbank.transaction.dto.TransactionDTO;
import com.willbank.transaction.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
@Tag(name = "Transaction Management", description = "APIs for managing bank transactions")
public class TransactionController {
    
    private final TransactionService transactionService;
    
    @PostMapping
    @Operation(summary = "Create a new transaction", description = "Creates a new transaction (deposit, withdrawal, or transfer)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Transaction created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input or insufficient balance")
    })
    public ResponseEntity<TransactionDTO> createTransaction(@Valid @RequestBody TransactionDTO transactionDTO) {
        TransactionDTO created = transactionService.createTransaction(transactionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get transaction by ID", description = "Retrieves a transaction by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Transaction found"),
        @ApiResponse(responseCode = "404", description = "Transaction not found")
    })
    public ResponseEntity<TransactionDTO> getTransactionById(@PathVariable("id") Long id) {
        TransactionDTO transaction = transactionService.getTransactionById(id);
        return ResponseEntity.ok(transaction);
    }
    
    @GetMapping("/reference/{reference}")
    @Operation(summary = "Get transaction by reference", description = "Retrieves a transaction by its reference number")
    public ResponseEntity<TransactionDTO> getTransactionByReference(@PathVariable("reference") String reference) {
        TransactionDTO transaction = transactionService.getTransactionByReference(reference);
        return ResponseEntity.ok(transaction);
    }
    
    @GetMapping("/account/{accountId}")
    @Operation(summary = "Get transactions by account ID", description = "Retrieves all transactions for a specific account")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByAccountId(@PathVariable("accountId") Long accountId) {
        List<TransactionDTO> transactions = transactionService.getTransactionsByAccountId(accountId);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/account/{accountId}/range")
    @Operation(summary = "Get transactions by date range", description = "Retrieves transactions for an account within a date range")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByDateRange(
            @PathVariable("accountId") Long accountId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<TransactionDTO> transactions = transactionService.getTransactionsByAccountIdAndDateRange(accountId, startDate, endDate);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping
    @Operation(summary = "Get all transactions", description = "Retrieves all transactions in the system")
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() {
        List<TransactionDTO> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }
}
