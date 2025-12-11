package com.willbank.account.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    
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
    public void sendAccountCreatedEmail(String to, String firstName, String lastName, 
                                       String accountNumber, String accountType) {
        try {
            log.info("Sending account created email to: {}", to);
            
            if (!isEmailConfigured()) {
                log.warn("Email not configured - Simulation mode: Account created email would be sent to {}", to);
                log.info("Email content: Account {} ({}) created for {} {}", accountNumber, accountType, firstName, lastName);
                return;
            }
            
            Context context = new Context();
            context.setVariable("firstName", firstName);
            context.setVariable("lastName", lastName);
            context.setVariable("accountNumber", accountNumber);
            context.setVariable("accountType", accountType);
            context.setVariable("appName", appName);
            context.setVariable("creationDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
            
            String htmlContent = buildAccountCreatedEmailTemplate(context);
            
            sendHtmlEmail(to, "Nouveau compte créé - " + appName, htmlContent);
            
            log.info("Account created email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send account created email to: {}", to, e);
        }
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
    
    private String buildAccountCreatedEmailTemplate(Context context) {
        // Simple HTML template inline since we might not have Thymeleaf templates configured
        String firstName = (String) context.getVariable("firstName");
        String lastName = (String) context.getVariable("lastName");
        String accountNumber = (String) context.getVariable("accountNumber");
        String accountType = (String) context.getVariable("accountType");
        String appName = (String) context.getVariable("appName");
        String creationDate = (String) context.getVariable("creationDate");
        
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <meta charset='UTF-8'>" +
                "    <style>" +
                "        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                "        .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                "        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }" +
                "        .content { background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px; }" +
                "        .account-info { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #4CAF50; }" +
                "        .footer { text-align: center; color: #777; font-size: 12px; margin-top: 20px; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div class='header'>" +
                "            <h1>" + appName + "</h1>" +
                "        </div>" +
                "        <div class='content'>" +
                "            <h2>Bonjour " + firstName + " " + lastName + ",</h2>" +
                "            <p>Nous avons le plaisir de vous informer que votre nouveau compte bancaire a été créé avec succès.</p>" +
                "            <div class='account-info'>" +
                "                <p><strong>Numéro de compte :</strong> " + accountNumber + "</p>" +
                "                <p><strong>Type de compte :</strong> " + accountType + "</p>" +
                "                <p><strong>Date de création :</strong> " + creationDate + "</p>" +
                "            </div>" +
                "            <p>Vous pouvez dès maintenant utiliser ce compte pour effectuer vos opérations bancaires.</p>" +
                "            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>" +
                "        </div>" +
                "        <div class='footer'>" +
                "            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>" +
                "            <p>&copy; 2025 " + appName + ". Tous droits réservés.</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }
}
