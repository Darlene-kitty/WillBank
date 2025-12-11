package com.willbank.account.controller;

import com.willbank.account.dto.AccountDTO;
import com.willbank.account.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
@Tag(name = "Account Management", description = "APIs for managing bank accounts")
public class AccountController {
    
    private final AccountService accountService;
    
    @PostMapping
    @Operation(summary = "Create a new account", description = "Creates a new bank account for a client")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Account created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<AccountDTO> createAccount(@Valid @RequestBody AccountDTO accountDTO) {
        AccountDTO created = accountService.createAccount(accountDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get account by ID", description = "Retrieves an account by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Account found"),
        @ApiResponse(responseCode = "404", description = "Account not found")
    })
    public ResponseEntity<AccountDTO> getAccountById(@PathVariable("id") Long id) {
        AccountDTO account = accountService.getAccountById(id);
        return ResponseEntity.ok(account);
    }
    
    @GetMapping("/number/{accountNumber}")
    @Operation(summary = "Get account by number", description = "Retrieves an account by its account number")
    public ResponseEntity<AccountDTO> getAccountByNumber(@PathVariable("accountNumber") String accountNumber) {
        AccountDTO account = accountService.getAccountByNumber(accountNumber);
        return ResponseEntity.ok(account);
    }
    
    @GetMapping("/client/{clientId}")
    @Operation(summary = "Get accounts by client ID", description = "Retrieves all accounts for a specific client")
    public ResponseEntity<List<AccountDTO>> getAccountsByClientId(@PathVariable("clientId") Long clientId) {
        List<AccountDTO> accounts = accountService.getAccountsByClientId(clientId);
        return ResponseEntity.ok(accounts);
    }
    
    @GetMapping
    @Operation(summary = "Get all accounts", description = "Retrieves all accounts in the system")
    public ResponseEntity<List<AccountDTO>> getAllAccounts() {
        List<AccountDTO> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(accounts);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update account", description = "Updates an existing account")
    public ResponseEntity<AccountDTO> updateAccount(@PathVariable("id") Long id, 
                                                     @Valid @RequestBody AccountDTO accountDTO) {
        AccountDTO updated = accountService.updateAccount(id, accountDTO);
        return ResponseEntity.ok(updated);
    }
    
    @GetMapping("/{id}/balance")
    @Operation(summary = "Get account balance", description = "Retrieves the balance of an account (cached)")
    public ResponseEntity<BigDecimal> getBalance(@PathVariable("id") Long id) {
        BigDecimal balance = accountService.getBalance(id);
        return ResponseEntity.ok(balance);
    }
    
    @PostMapping("/{id}/credit")
    @Operation(summary = "Credit account", description = "Credits an amount to an account")
    public ResponseEntity<Void> creditAccount(@PathVariable("id") Long id, @RequestParam BigDecimal amount) {
        accountService.credit(id, amount);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{id}/debit")
    @Operation(summary = "Debit account", description = "Debits an amount from an account")
    public ResponseEntity<Void> debitAccount(@PathVariable("id") Long id, @RequestParam BigDecimal amount) {
        accountService.debit(id, amount);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete account", description = "Deletes an account from the system")
    public ResponseEntity<Void> deleteAccount(@PathVariable("id") Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}
