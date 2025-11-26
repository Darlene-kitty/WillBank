package com.willbank.dashboard.client;

import com.willbank.dashboard.dto.AccountDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "account-service", url = "lb://account-service")
public interface AccountServiceClient {
    
    @GetMapping("/api/accounts/client/{clientId}")
    List<AccountDTO> getAccountsByClientId(@PathVariable("clientId") Long clientId);
    
    @GetMapping("/api/accounts/{id}")
    AccountDTO getAccountById(@PathVariable("id") Long id);
}
