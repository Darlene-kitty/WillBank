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
        log.info("Publishing TransactionCreatedEvent: {}", event);
        rabbitTemplate.convertAndSend(exchangeName, transactionCreatedRoutingKey, event);
    }
    
    public void publishAccountCredited(AccountCreditedEvent event) {
        log.info("Publishing AccountCreditedEvent: {}", event);
        rabbitTemplate.convertAndSend(exchangeName, accountCreditedRoutingKey, event);
    }
    
    public void publishAccountDebited(AccountDebitedEvent event) {
        log.info("Publishing AccountDebitedEvent: {}", event);
        rabbitTemplate.convertAndSend(exchangeName, accountDebitedRoutingKey, event);
    }
    
    public void publishClientUpdated(ClientUpdatedEvent event) {
        log.info("Publishing ClientUpdatedEvent: {}", event);
        rabbitTemplate.convertAndSend(exchangeName, clientUpdatedRoutingKey, event);
    }
}
