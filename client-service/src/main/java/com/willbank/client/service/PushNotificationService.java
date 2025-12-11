package com.willbank.client.service;

import com.google.firebase.FirebaseApp;
import com.google.firebase.messaging.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PushNotificationService {
    
    private boolean isFirebaseInitialized() {
        return !FirebaseApp.getApps().isEmpty();
    }
    
    @Async
    public void sendWelcomePushNotification(String fcmToken, String firstName) {
        if (fcmToken == null || fcmToken.isBlank()) {
            log.debug("No FCM token provided, skipping push notification");
            return;
        }
        
        if (!isFirebaseInitialized()) {
            log.debug("Firebase not initialized, skipping push notification");
            return;
        }
        
        try {
            log.info("Sending welcome push notification to token: {}", maskToken(fcmToken));
            
            Message message = Message.builder()
                    .setToken(fcmToken)
                    .setNotification(Notification.builder()
                            .setTitle("Bienvenue chez WillBank !")
                            .setBody("Bonjour " + firstName + ", votre compte a été créé avec succès.")
                            .build())
                    .putData("type", "WELCOME")
                    .putData("timestamp", String.valueOf(System.currentTimeMillis()))
                    .setAndroidConfig(AndroidConfig.builder()
                            .setPriority(AndroidConfig.Priority.HIGH)
                            .setNotification(AndroidNotification.builder()
                                    .setColor("#0D47A1")
                                    .setIcon("ic_notification")
                                    .build())
                            .build())
                    .setApnsConfig(ApnsConfig.builder()
                            .setAps(Aps.builder()
                                    .setSound("default")
                                    .build())
                            .build())
                    .build();
            
            String response = FirebaseMessaging.getInstance().send(message);
            log.info("Welcome push notification sent successfully: {}", response);
            
        } catch (FirebaseMessagingException e) {
            log.error("Failed to send welcome push notification to token: {}", maskToken(fcmToken), e);
        } catch (Exception e) {
            log.error("Unexpected error sending welcome push notification", e);
        }
    }
    
    @Async
    public void sendFirstLoginPushNotification(String fcmToken, String firstName) {
        if (fcmToken == null || fcmToken.isBlank()) {
            log.debug("No FCM token provided, skipping push notification");
            return;
        }
        
        if (!isFirebaseInitialized()) {
            log.debug("Firebase not initialized, skipping push notification");
            return;
        }
        
        try {
            log.info("Sending first login push notification to token: {}", maskToken(fcmToken));
            
            Message message = Message.builder()
                    .setToken(fcmToken)
                    .setNotification(Notification.builder()
                            .setTitle("Première connexion réussie !")
                            .setBody("Bonjour " + firstName + ", bienvenue dans votre espace WillBank.")
                            .build())
                    .putData("type", "FIRST_LOGIN")
                    .putData("timestamp", String.valueOf(System.currentTimeMillis()))
                    .setAndroidConfig(AndroidConfig.builder()
                            .setPriority(AndroidConfig.Priority.HIGH)
                            .setNotification(AndroidNotification.builder()
                                    .setColor("#00BCD4")
                                    .setIcon("ic_notification")
                                    .build())
                            .build())
                    .setApnsConfig(ApnsConfig.builder()
                            .setAps(Aps.builder()
                                    .setSound("default")
                                    .build())
                            .build())
                    .build();
            
            String response = FirebaseMessaging.getInstance().send(message);
            log.info("First login push notification sent successfully: {}", response);
            
        } catch (FirebaseMessagingException e) {
            log.error("Failed to send first login push notification to token: {}", maskToken(fcmToken), e);
        } catch (Exception e) {
            log.error("Unexpected error sending first login push notification", e);
        }
    }
    
    @Async
    public void sendPasswordChangedPushNotification(String fcmToken, String firstName) {
        if (fcmToken == null || fcmToken.isBlank()) {
            log.debug("No FCM token provided, skipping push notification");
            return;
        }
        
        if (!isFirebaseInitialized()) {
            log.debug("Firebase not initialized, skipping push notification");
            return;
        }
        
        try {
            log.info("Sending password changed push notification to token: {}", maskToken(fcmToken));
            
            Message message = Message.builder()
                    .setToken(fcmToken)
                    .setNotification(Notification.builder()
                            .setTitle("Mot de passe modifié")
                            .setBody("Votre mot de passe a été modifié avec succès.")
                            .build())
                    .putData("type", "PASSWORD_CHANGED")
                    .putData("timestamp", String.valueOf(System.currentTimeMillis()))
                    .setAndroidConfig(AndroidConfig.builder()
                            .setPriority(AndroidConfig.Priority.HIGH)
                            .setNotification(AndroidNotification.builder()
                                    .setColor("#2E7D32")
                                    .setIcon("ic_notification")
                                    .build())
                            .build())
                    .setApnsConfig(ApnsConfig.builder()
                            .setAps(Aps.builder()
                                    .setSound("default")
                                    .build())
                            .build())
                    .build();
            
            String response = FirebaseMessaging.getInstance().send(message);
            log.info("Password changed push notification sent successfully: {}", response);
            
        } catch (FirebaseMessagingException e) {
            log.error("Failed to send password changed push notification to token: {}", maskToken(fcmToken), e);
        } catch (Exception e) {
            log.error("Unexpected error sending password changed push notification", e);
        }
    }
    
    @Async
    public void sendCustomPushNotification(String fcmToken, String title, String body, Map<String, String> data) {
        if (fcmToken == null || fcmToken.isBlank()) {
            log.debug("No FCM token provided, skipping push notification");
            return;
        }
        
        if (!isFirebaseInitialized()) {
            log.debug("Firebase not initialized, skipping push notification");
            return;
        }
        
        try {
            log.info("Sending custom push notification to token: {}", maskToken(fcmToken));
            
            Message.Builder messageBuilder = Message.builder()
                    .setToken(fcmToken)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .setAndroidConfig(AndroidConfig.builder()
                            .setPriority(AndroidConfig.Priority.HIGH)
                            .build())
                    .setApnsConfig(ApnsConfig.builder()
                            .setAps(Aps.builder()
                                    .setSound("default")
                                    .build())
                            .build());
            
            if (data != null && !data.isEmpty()) {
                messageBuilder.putAllData(data);
            }
            
            String response = FirebaseMessaging.getInstance().send(messageBuilder.build());
            log.info("Custom push notification sent successfully: {}", response);
            
        } catch (FirebaseMessagingException e) {
            log.error("Failed to send custom push notification to token: {}", maskToken(fcmToken), e);
        } catch (Exception e) {
            log.error("Unexpected error sending custom push notification", e);
        }
    }
    
    private String maskToken(String token) {
        if (token == null || token.length() < 10) {
            return "***";
        }
        return token.substring(0, 5) + "..." + token.substring(token.length() - 5);
    }
}
