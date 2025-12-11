package com.willbank.transaction.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;

@FeignClient(name = "account-service")
public interface AccountClient {
    
    @PostMapping("/api/accounts/{id}/credit")
    void credit(@PathVariable("id") Long accountId, @RequestParam("amount") BigDecimal amount);
    
    @PostMapping("/api/accounts/{id}/debit")
    void debit(@PathVariable("id") Long accountId, @RequestParam("amount") BigDecimal amount);
}
