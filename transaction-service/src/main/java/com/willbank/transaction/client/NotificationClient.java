package com.willbank.transaction.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service", path = "/api/notifications")
public interface NotificationClient {
    
    @PostMapping("/send")
    ResponseEntity<Void> sendNotification(@RequestBody NotificationRequest request);
}
