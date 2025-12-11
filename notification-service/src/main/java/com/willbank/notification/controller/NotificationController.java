package com.willbank.notification.controller;

import com.willbank.notification.dto.NotificationRequest;
import com.willbank.notification.entity.Notification;
import com.willbank.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
@Tag(name = "Notification Management", description = "APIs for managing notifications")
public class NotificationController {
    
    private final NotificationService notificationService;
    
    @GetMapping("/recipient/{recipient}")
    @Operation(summary = "Get notifications by recipient", description = "Retrieves all notifications for a specific recipient")
    public ResponseEntity<List<Notification>> getNotificationsByRecipient(@PathVariable("recipient") String recipient) {
        List<Notification> notifications = notificationService.getNotificationsByRecipient(recipient);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping
    @Operation(summary = "Get all notifications", description = "Retrieves all notifications in the system")
    public ResponseEntity<List<Notification>> getAllNotifications() {
        List<Notification> notifications = notificationService.getAllNotifications();
        return ResponseEntity.ok(notifications);
    }
    
    @PostMapping("/send")
    @Operation(summary = "Send notification", description = "Creates and sends a notification to a recipient")
    public ResponseEntity<Notification> sendNotification(@RequestBody NotificationRequest request) {
        Notification.NotificationType type;
        try {
            type = Notification.NotificationType.valueOf(request.getType().toUpperCase());
        } catch (IllegalArgumentException e) {
            type = Notification.NotificationType.IN_APP;
        }
        
        Notification notification = notificationService.createNotification(
            type,
            request.getRecipient(),
            request.getMessage(),
            request.getEventData()
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(notification);
    }
}
