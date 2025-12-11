package com.willbank.transaction.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${app.email.from:noreply@willbank.com}")
    private String fromEmail;
    
    @Value("${app.name:WillBank}")
    private String appName;
    
    @Value("${spring.mail.username:}")
    private String mailUsername;
    
    private boolean isEmailConfigured() {
        return mailUsername != null && 
               !mailUsername.isEmpty() && 
               !mailUsername.equals("test@example.com");
    }
    
    @Async
    public void sendTransactionNotificationEmail(String to, String firstName, String transactionType,
                                                BigDecimal amount, String accountNumber, 
                                                String transactionReference, BigDecimal newBalance) {
        try {
            log.info("Sending transaction notification email to: {}", to);
            
            if (!isEmailConfigured()) {
                log.warn("Email not configured - Simulation mode: Transaction email would be sent to {}", to);
                log.info("Email content: {} transaction of {} for account {}, new balance: {}", 
                        transactionType, amount, accountNumber, newBalance);
                return;
            }
            
            String subject = getTransactionEmailSubject(transactionType);
            String htmlContent = buildTransactionEmailTemplate(
                firstName, transactionType, amount, accountNumber, 
                transactionReference, newBalance, LocalDateTime.now()
            );
            
            sendHtmlEmail(to, subject, htmlContent);
            
            log.info("Transaction notification email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send transaction notification email to: {}", to, e);
        }
    }
    
    private String getTransactionEmailSubject(String transactionType) {
        return switch (transactionType.toUpperCase()) {
            case "DEPOSIT" -> "Dépôt effectué - " + appName;
            case "WITHDRAWAL" -> "Retrait effectué - " + appName;
            case "TRANSFER" -> "Virement effectué - " + appName;
            default -> "Transaction effectuée - " + appName;
        };
    }
    
    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                message,
                MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                StandardCharsets.UTF_8.name()
        );
        
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        
        mailSender.send(message);
    }
    
    private String buildTransactionEmailTemplate(String firstName, String transactionType,
                                                 BigDecimal amount, String accountNumber,
                                                 String transactionReference, BigDecimal newBalance,
                                                 LocalDateTime transactionDate) {
        
        String operationIcon = getOperationIcon(transactionType);
        String operationColor = getOperationColor(transactionType);
        String operationText = getOperationText(transactionType);
        String dateFormatted = transactionDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm"));
        
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <meta charset='UTF-8'>" +
                "    <style>" +
                "        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                "        .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                "        .header { background-color: " + operationColor + "; color: white; padding: 20px; text-align: center; }" +
                "        .content { background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px; }" +
                "        .transaction-info { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid " + operationColor + "; }" +
                "        .amount { font-size: 24px; font-weight: bold; color: " + operationColor + "; }" +
                "        .balance { background-color: #e8f5e9; padding: 10px; margin: 10px 0; border-radius: 5px; }" +
                "        .footer { text-align: center; color: #777; font-size: 12px; margin-top: 20px; }" +
                "        .icon { font-size: 48px; margin-bottom: 10px; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div class='header'>" +
                "            <div class='icon'>" + operationIcon + "</div>" +
                "            <h1>" + appName + "</h1>" +
                "            <h2>" + operationText + "</h2>" +
                "        </div>" +
                "        <div class='content'>" +
                "            <h2>Bonjour " + firstName + ",</h2>" +
                "            <p>Une opération a été effectuée sur votre compte.</p>" +
                "            <div class='transaction-info'>" +
                "                <p><strong>Montant :</strong> <span class='amount'>" + String.format("%.2f", amount) + " MAD</span></p>" +
                "                <p><strong>Type d'opération :</strong> " + operationText + "</p>" +
                "                <p><strong>Numéro de compte :</strong> " + accountNumber + "</p>" +
                "                <p><strong>Référence :</strong> " + transactionReference + "</p>" +
                "                <p><strong>Date et heure :</strong> " + dateFormatted + "</p>" +
                "            </div>" +
                "            <div class='balance'>" +
                "                <p><strong>Nouveau solde :</strong> <span style='font-size: 18px; color: #2e7d32;'>" + 
                String.format("%.2f", newBalance) + " MAD</span></p>" +
                "            </div>" +
                "            <p style='color: #666; font-size: 14px;'>Si vous n'êtes pas à l'origine de cette opération, contactez immédiatement votre agence.</p>" +
                "        </div>" +
                "        <div class='footer'>" +
                "            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>" +
                "            <p>&copy; 2025 " + appName + ". Tous droits réservés.</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }
    
    private String getOperationIcon(String transactionType) {
        return switch (transactionType.toUpperCase()) {
            case "DEPOSIT" -> "💰";
            case "WITHDRAWAL" -> "💸";
            case "TRANSFER" -> "🔄";
            default -> "💳";
        };
    }
    
    private String getOperationColor(String transactionType) {
        return switch (transactionType.toUpperCase()) {
            case "DEPOSIT" -> "#4CAF50";
            case "WITHDRAWAL" -> "#f44336";
            case "TRANSFER" -> "#2196F3";
            default -> "#9E9E9E";
        };
    }
    
    private String getOperationText(String transactionType) {
        return switch (transactionType.toUpperCase()) {
            case "DEPOSIT" -> "Dépôt";
            case "WITHDRAWAL" -> "Retrait";
            case "TRANSFER" -> "Virement";
            default -> "Transaction";
        };
    }
}
