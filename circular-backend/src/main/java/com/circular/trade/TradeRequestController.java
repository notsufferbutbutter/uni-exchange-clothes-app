package com.circular.trade;

import com.circular.trade.dto.UpdateTradeStatusRequest;
import com.circular.trade.dto.CreateTradeRequestRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;

@RestController
@RequestMapping("/api/trade-requests")
public class TradeRequestController {

    private final TradeRequestService service;

    public TradeRequestController(TradeRequestService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<TradeRequest> create(@RequestBody CreateTradeRequestRequest req) {
        TradeRequest tr = service.create(req.getRequesterId(), req.getReceiverId(), req.getRequestedArticleId(), req.getOfferedArticleIds(), req.getMessage());
        return ResponseEntity.ok(tr);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TradeRequest> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/receiver/{receiverId}")
    public ResponseEntity<List<TradeRequest>> forReceiver(@PathVariable Long receiverId) {
        return ResponseEntity.ok(service.findByReceiver(receiverId));
    }

    @GetMapping("/requester/{requesterId}")
    public ResponseEntity<List<TradeRequest>> forRequester(@PathVariable Long requesterId) {
        return ResponseEntity.ok(service.findByRequester(requesterId));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<TradeRequest>> history(@PathVariable Long userId) {
        List<TradeRequest> combined = new ArrayList<>();
        combined.addAll(service.findByRequester(userId));
        combined.addAll(service.findByReceiver(userId));
        combined.sort(Comparator.comparing(TradeRequest::getCreatedAt).reversed());
        return ResponseEntity.ok(combined);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TradeRequest> updateStatus(@PathVariable Long id, @RequestBody UpdateTradeStatusRequest req) {
        TradeRequestStatus s = req.getStatus();
        if (s == null || (s != TradeRequestStatus.ACCEPTED && s != TradeRequestStatus.REJECTED && s != TradeRequestStatus.PENDING)) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(service.updateStatus(id, s));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
