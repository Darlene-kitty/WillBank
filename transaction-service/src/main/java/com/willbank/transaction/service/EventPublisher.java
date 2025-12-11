package com.willbank.transaction.service;

import com.willbank.transaction.event.AccountCreditedEvent;
import com.willbank.transaction.event.AccountDebitedEvent;
import com.willbank.transaction.event.ClientUpdatedEvent;
import com.willbank.transaction.event.TransactionCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventPublisher {
    
    private final RabbitTemplate rabbitTemplate;
    
    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;
    
    @Value("${rabbitmq.routing.transaction-created}")
    private String transactionCreatedRoutingKey;
    
    @Value("${rabbitmq.routing.account-credited}")
    private String accountCreditedRoutingKey;
    
    @Value("${rabbitmq.routing.account-debited}")
    private String accountDebitedRoutingKey;
    
    @Value("${rabbitmq.routing.client-updated}")
    private String clientUpdatedRoutingKey;
    
    public void publishTransactionCreated(TransactionCreatedEvent event) {
        try {
            log.info("Publishing TransactionCreatedEvent: {}", event);
            rabbitTemplate.convertAndSend(exchangeName, transactionCreatedRoutingKey, event);
        } catch (Exception e) {
            log.warn("Failed to publish TransactionCreatedEvent, RabbitMQ may not be available: {}", e.getMessage());
        }
    }
    
    public void publishAccountCredited(AccountCreditedEvent event) {
        try {
            log.info("Publishing AccountCreditedEvent: {}", event);
            rabbitTemplate.convertAndSend(exchangeName, accountCreditedRoutingKey, event);
        } catch (Exception e) {
            log.warn("Failed to publish AccountCreditedEvent, RabbitMQ may not be available: {}", e.getMessage());
        }
    }
    
    public void publishAccountDebited(AccountDebitedEvent event) {
        try {
            log.info("Publishing AccountDebitedEvent: {}", event);
            rabbitTemplate.convertAndSend(exchangeName, accountDebitedRoutingKey, event);
        } catch (Exception e) {
            log.warn("Failed to publish AccountDebitedEvent, RabbitMQ may not be available: {}", e.getMessage());
        }
    }
    
    public void publishClientUpdated(ClientUpdatedEvent event) {
        try {
            log.info("Publishing ClientUpdatedEvent: {}", event);
            rabbitTemplate.convertAndSend(exchangeName, clientUpdatedRoutingKey, event);
        } catch (Exception e) {
            log.warn("Failed to publish ClientUpdatedEvent, RabbitMQ may not be available: {}", e.getMessage());
        }
    }
}
