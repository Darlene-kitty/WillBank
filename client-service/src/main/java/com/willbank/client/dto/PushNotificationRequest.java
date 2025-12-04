package com.willbank.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PushNotificationRequest {
    
    private String token;
    private String title;
    private String body;
    private String imageUrl;
    private java.util.Map<String, String> data;
}
