package com.circular.trade;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TradeRequestRepository extends JpaRepository<TradeRequest, Long> {
    List<TradeRequest> findByReceiverId(Long receiverId);
    List<TradeRequest> findByRequesterId(Long requesterId);
}

