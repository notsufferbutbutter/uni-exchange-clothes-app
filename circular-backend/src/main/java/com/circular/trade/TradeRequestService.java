package com.circular.trade;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

import com.circular.notification.NotificationService;

@Service
public class TradeRequestService {

    private final TradeRequestRepository repo;
    private final NotificationService notificationService;

    public TradeRequestService(TradeRequestRepository repo, NotificationService notificationService) {
        this.repo = repo;
        this.notificationService = notificationService;
    }

    public TradeRequest create(Long requesterId, Long receiverId, Long requestedArticleId, List<Long> offeredArticleIds, String message) {
        if (requesterId == null || receiverId == null || requestedArticleId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "requesterId, receiverId and requestedArticleId are required");
        }
        TradeRequest tr = new TradeRequest(requesterId, receiverId, requestedArticleId, offeredArticleIds, message);
        TradeRequest saved = repo.save(tr);
        // notify receiver
        notificationService.create(receiverId, "TRADE_REQUEST", "Neue Tauschanfrage von user " + requesterId);
        return saved;
    }

    public TradeRequest findById(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tauschanfrage nicht gefunden"));
    }

    public List<TradeRequest> findByReceiver(Long receiverId) {
        return repo.findByReceiverId(receiverId);
    }

    public List<TradeRequest> findByRequester(Long requesterId) {
        return repo.findByRequesterId(requesterId);
    }

    @Transactional
    public TradeRequest updateStatus(Long id, TradeRequestStatus newStatus) {
        TradeRequest tr = findById(id);
        if (tr.getStatus() == newStatus) {
            return tr;
        }
        tr.setStatus(newStatus);
        TradeRequest updated = repo.save(tr);
        // notify requester about status change
        notificationService.create(updated.getRequesterId(), "TRADE_STATUS", "Tauschanfrage " + id + " wurde auf " + newStatus.name() + " gesetzt");
        return updated;
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
