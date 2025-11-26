package com.willbank.notification.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.willbank.notification.entity.Notification;
import com.willbank.notification.event.AccountCreditedEvent;
import com.willbank.notification.event.AccountDebitedEvent;
import com.willbank.notification.event.ClientUpdatedEvent;
import com.willbank.notification.event.TransactionCreatedEvent;
import com.willbank.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class EventListener {
    
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @RabbitListener(queues = "${rabbitmq.queue.name}")
    public void handleTransactionCreatedEvent(TransactionCreatedEvent event) {
        try {
            log.info("Received TransactionCreatedEvent: {}", event);
            
            String message = String.format(
                "Transaction %s created: %s of %.2f on account %d",
                event.getTransactionReference(),
                event.getType(),
                event.getAmount(),
                event.getSourceAccountId()
            );
            
            String eventData = objectMapper.writeValueAsString(event);
            
            notificationService.createNotification(
                Notification.NotificationType.EMAIL,
                "account-" + event.getSourceAccountId() + "@willbank.com",
                message,
                eventData
            );
            
            notificationService.createNotification(
                Notification.NotificationType.PUSH,
                "device-token-" + event.getSourceAccountId(),
                message,
                eventData
            );
            
        } catch (Exception e) {
            log.error("Error handling TransactionCreatedEvent: {}", e.getMessage(), e);
        }
    }
    
    @RabbitListener(queues = "${rabbitmq.queue.name}")
    public void handleAccountCreditedEvent(AccountCreditedEvent event) {
        try {
            log.info("Received AccountCreditedEvent: {}", event);
            
            String message = String.format(
                "Your account %d has been credited with %.2f. Transaction: %s",
                event.getAccountId(),
                event.getAmount(),
                event.getTransactionReference()
            );
            
            String eventData = objectMapper.writeValueAsString(event);
            
            notificationService.createNotification(
                Notification.NotificationType.EMAIL,
                "account-" + event.getAccountId() + "@willbank.com",
                message,
                eventData
            );
            
            notificationService.createNotification(
                Notification.NotificationType.PUSH,
                "device-token-" + event.getAccountId(),
                message,
                eventData
            );
            
        } catch (Exception e) {
            log.error("Error handling AccountCreditedEvent: {}", e.getMessage(), e);
        }
    }
    
    @RabbitListener(queues = "${rabbitmq.queue.name}")
    public void handleAccountDebitedEvent(AccountDebitedEvent event) {
        try {
            log.info("Received AccountDebitedEvent: {}", event);
            
            String message = String.format(
                "Your account %d has been debited with %.2f. Transaction: %s",
                event.getAccountId(),
                event.getAmount(),
                event.getTransactionReference()
            );
            
            String eventData = objectMapper.writeValueAsString(event);
            
            notificationService.createNotification(
                Notification.NotificationType.EMAIL,
                "account-" + event.getAccountId() + "@willbank.com",
                message,
                eventData
            );
            
            notificationService.createNotification(
                Notification.NotificationType.PUSH,
                "device-token-" + event.getAccountId(),
                message,
                eventData
            );
            
        } catch (Exception e) {
            log.error("Error handling AccountDebitedEvent: {}", e.getMessage(), e);
        }
    }
    
    @RabbitListener(queues = "${rabbitmq.queue.name}")
    public void handleClientUpdatedEvent(ClientUpdatedEvent event) {
        try {
            log.info("Received ClientUpdatedEvent: {}", event);
            
            String message = String.format(
                "Your profile has been updated. Update type: %s",
                event.getUpdateType()
            );
            
            String eventData = objectMapper.writeValueAsString(event);
            
            notificationService.createNotification(
                Notification.NotificationType.EMAIL,
                event.getEmail(),
                message,
                eventData
            );
            
        } catch (Exception e) {
            log.error("Error handling ClientUpdatedEvent: {}", e.getMessage(), e);
        }
    }
}
