package com.willbank.notification.service;

import com.willbank.notification.entity.Notification;
import com.willbank.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    private final PushNotificationService pushNotificationService;
    
    @Transactional
    public Notification createNotification(Notification.NotificationType type, String recipient, String message, String eventData) {
        log.info("Creating notification for recipient: {}", recipient);
        
        Notification notification = new Notification();
        notification.setType(type);
        notification.setRecipient(recipient);
        notification.setMessage(message);
        notification.setEventData(eventData);
        notification.setStatus(Notification.NotificationStatus.PENDING);
        
        Notification saved = notificationRepository.save(notification);
        
        // Send notification asynchronously
        sendNotification(saved);
        
        return saved;
    }
    
    private void sendNotification(Notification notification) {
        try {
            switch (notification.getType()) {
                case EMAIL:
                    emailService.sendEmail(notification.getRecipient(), "WillBank Notification", notification.getMessage());
                    break;
                case PUSH:
                    pushNotificationService.sendPushNotification(notification.getRecipient(), notification.getMessage());
                    break;
                case SMS:
                    log.info("SMS notification would be sent to: {}", notification.getRecipient());
                    break;
                case IN_APP:
                    log.info("In-app notification created for: {}", notification.getRecipient());
                    break;
            }
            
            notification.setStatus(Notification.NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
            notificationRepository.save(notification);
            
            log.info("Notification sent successfully to: {}", notification.getRecipient());
            
        } catch (Exception e) {
            log.error("Failed to send notification: {}", e.getMessage());
            notification.setStatus(Notification.NotificationStatus.FAILED);
            notificationRepository.save(notification);
        }
    }
    
    public List<Notification> getNotificationsByRecipient(String recipient) {
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(recipient);
    }
    
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
}
