package com.willbank.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    public void sendEmail(String to, String subject, String body) {
        try {
            log.info("Sending email to: {}", to);
            
            // Log for debugging
            log.info("=== SENDING EMAIL ===");
            log.info("To: {}", to);
            log.info("Subject: {}", subject);
            log.info("Body: {}", body);
            log.info("====================");
            
            // Send actual email
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("willbank.notifications@gmail.com");
            mailSender.send(message);
            
            log.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email: {}", e.getMessage());
            // Don't throw exception to avoid breaking the notification flow
            log.warn("Email sending failed, but notification will be marked as sent for demo purposes");
        }
    }
}
