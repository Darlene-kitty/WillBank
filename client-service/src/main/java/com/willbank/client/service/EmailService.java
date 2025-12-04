package com.willbank.client.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    
    @Value("${app.email.from}")
    private String fromEmail;
    
    @Value("${app.name}")
    private String appName;
    
    @Value("${spring.mail.username:}")
    private String mailUsername;
    
    private boolean isEmailConfigured() {
        return mailUsername != null && 
               !mailUsername.isEmpty() && 
               !mailUsername.equals("test@example.com");
    }
    
    @Async
    public void sendWelcomeEmail(String to, String firstName, String lastName) {
        try {
            log.info("Sending welcome email to: {}", to);
            
            if (!isEmailConfigured()) {
                log.warn("Email not configured - Simulation mode: Welcome email would be sent to {}", to);
                return;
            }
            
            Map<String, Object> variables = Map.of(
                "firstName", firstName,
                "lastName", lastName,
                "appName", appName
            );
            
            sendTemplateEmail(to, "Bienvenue chez " + appName, "welcome-email", variables);
            
            log.info("Welcome email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", to, e);
        }
    }
    
    @Async
    public void sendFirstLoginEmail(String to, String firstName, LocalDateTime loginDate) {
        try {
            log.info("Sending first login email to: {}", to);
            
            if (!isEmailConfigured()) {
                log.warn("Email not configured - Simulation mode: First login email would be sent to {}", to);
                return;
            }
            
            Map<String, Object> variables = Map.of(
                "firstName", firstName,
                "email", to,
                "loginDate", loginDate,
                "appName", appName
            );
            
            sendTemplateEmail(to, "Première connexion - " + appName, "first-login-email", variables);
            
            log.info("First login email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send first login email to: {}", to, e);
        }
    }
    
    @Async
    public void sendPasswordChangedEmail(String to, String firstName, LocalDateTime changeDate) {
        try {
            log.info("Sending password changed email to: {}", to);
            
            if (!isEmailConfigured()) {
                log.warn("Email not configured - Simulation mode: Password changed email would be sent to {}", to);
                return;
            }
            
            Map<String, Object> variables = Map.of(
                "firstName", firstName,
                "email", to,
                "changeDate", changeDate,
                "appName", appName
            );
            
            sendTemplateEmail(to, "Mot de passe modifié - " + appName, "password-changed-email", variables);
            
            log.info("Password changed email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send password changed email to: {}", to, e);
        }
    }
    
    private void sendTemplateEmail(String to, String subject, String templateName, Map<String, Object> variables) 
            throws MessagingException {
        
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                message,
                MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                StandardCharsets.UTF_8.name()
        );
        
        Context context = new Context();
        context.setVariables(variables);
        
        String html = templateEngine.process(templateName, context);
        
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(html, true);
        
        mailSender.send(message);
    }
    
    @Async
    public void sendCustomEmail(String to, String subject, String templateName, Map<String, Object> variables) {
        try {
            log.info("Sending custom email to: {} with template: {}", to, templateName);
            sendTemplateEmail(to, subject, templateName, variables);
            log.info("Custom email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send custom email to: {}", to, e);
        }
    }
}
