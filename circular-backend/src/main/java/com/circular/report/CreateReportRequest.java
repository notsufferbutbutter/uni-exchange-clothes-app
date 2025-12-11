package com.circular.report;

public class CreateReportRequest {
    private Long reporterId;
    private String contentType;
    private Long contentId;
    private String reason;

    public Long getReporterId() { return reporterId; }
    public void setReporterId(Long reporterId) { this.reporterId = reporterId; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public Long getContentId() { return contentId; }
    public void setContentId(Long contentId) { this.contentId = contentId; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}

