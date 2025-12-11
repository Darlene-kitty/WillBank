package com.willbank.notification.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientUpdatedEvent {
    private Long clientId;
    private String email;
    private String updateType;
    private LocalDateTime timestamp;
}
