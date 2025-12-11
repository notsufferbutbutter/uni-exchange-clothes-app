package com.circular.trade.dto;

import java.util.List;

public class CreateTradeRequestRequest {
    private Long requesterId;
    private Long receiverId;
    private Long requestedArticleId;
    private List<Long> offeredArticleIds;
    private String message;

    public CreateTradeRequestRequest() {}

    public Long getRequesterId() { return requesterId; }
    public void setRequesterId(Long requesterId) { this.requesterId = requesterId; }

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public Long getRequestedArticleId() { return requestedArticleId; }
    public void setRequestedArticleId(Long requestedArticleId) { this.requestedArticleId = requestedArticleId; }

    public List<Long> getOfferedArticleIds() { return offeredArticleIds; }
    public void setOfferedArticleIds(List<Long> offeredArticleIds) { this.offeredArticleIds = offeredArticleIds; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}

