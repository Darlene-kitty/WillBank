package com.willbank.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    private String type;  // IN_APP, EMAIL, PUSH, SMS
    private String recipient;
    private String message;
    private String eventData;
}
