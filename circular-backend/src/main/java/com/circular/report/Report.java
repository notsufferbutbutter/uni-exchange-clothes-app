package com.circular.report;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "REPORT")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "REPORTER_ID")
    private Long reporterId; // who reported

    @Column(name = "CONTENT_TYPE")
    private String contentType; // e.g., ARTICLE, MESSAGE

    @Column(name = "CONTENT_ID")
    private Long contentId; // id of the reported entity

    @Column(name = "REASON", length = 2000)
    private String reason;

    @Column(name = "CREATED_AT")
    private Instant createdAt = Instant.now();

    public Report() {}

    public Report(Long reporterId, String contentType, Long contentId, String reason) {
        this.reporterId = reporterId;
        this.contentType = contentType;
        this.contentId = contentId;
        this.reason = reason;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getReporterId() { return reporterId; }
    public void setReporterId(Long reporterId) { this.reporterId = reporterId; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public Long getContentId() { return contentId; }
    public void setContentId(Long contentId) { this.contentId = contentId; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

