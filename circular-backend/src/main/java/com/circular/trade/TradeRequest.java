package com.circular.trade;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "TRADE_REQUEST")
public class TradeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "REQUESTER_ID")
    private Long requesterId; // Profile id of the requester

    @Column(name = "RECEIVER_ID")
    private Long receiverId; // Profile id of the owner of the offered article

    @Column(name = "REQUESTED_ARTICLE_ID")
    private Long requestedArticleId; // id of the article being requested (on receiver side)

    // offered articles from the requester (can be empty)
    @ElementCollection
    @CollectionTable(name = "TRADE_REQUEST_OFFERED_ARTICLES", joinColumns = @JoinColumn(name = "TRADE_REQUEST_ID"))
    @Column(name = "OFFERED_ARTICLE_ID")
    private List<Long> offeredArticleIds = new ArrayList<>();

    @Column(name = "MESSAGE", length = 2000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS")
    private TradeRequestStatus status = TradeRequestStatus.PENDING;

    @Column(name = "CREATED_AT")
    private Instant createdAt = Instant.now();

    public TradeRequest() {}

    public TradeRequest(Long requesterId, Long receiverId, Long requestedArticleId, List<Long> offeredArticleIds, String message) {
        this.requesterId = requesterId;
        this.receiverId = receiverId;
        this.requestedArticleId = requestedArticleId;
        if (offeredArticleIds != null) this.offeredArticleIds = offeredArticleIds;
        this.message = message;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public TradeRequestStatus getStatus() { return status; }
    public void setStatus(TradeRequestStatus status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
