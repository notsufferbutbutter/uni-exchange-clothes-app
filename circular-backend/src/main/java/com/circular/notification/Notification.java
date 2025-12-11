package com.circular.notification;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "NOTIFICATION")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "USER_ID")
    private Long userId; // recipient

    @Column(name = "TYPE")
    private String type; // e.g., MESSAGE, TRADE_REQUEST, TRADE_STATUS

    @Column(name = "PAYLOAD", length = 2000)
    private String payload; // optional JSON or message

    @Column(name = "READ_FLAG")
    private Boolean read = Boolean.FALSE;

    @Column(name = "CREATED_AT")
    private Instant createdAt = Instant.now();

    public Notification() {}

    public Notification(Long userId, String type, String payload) {
        this.userId = userId;
        this.type = type;
        this.payload = payload;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }
    public Boolean getRead() { return read; }
    public void setRead(Boolean read) { this.read = read; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

