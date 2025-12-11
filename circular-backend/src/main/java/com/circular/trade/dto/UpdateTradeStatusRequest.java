package com.circular.trade.dto;

import com.circular.trade.TradeRequestStatus;

public class UpdateTradeStatusRequest {
    private TradeRequestStatus status;

    public UpdateTradeStatusRequest() {}

    public UpdateTradeStatusRequest(TradeRequestStatus status) { this.status = status; }

    public TradeRequestStatus getStatus() { return status; }
    public void setStatus(TradeRequestStatus status) { this.status = status; }
}

