package com.circular.notification;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repo;

    public Notification create(Long userId, String type, String payload) {
        Notification n = new Notification(userId, type, payload);
        return repo.save(n);
    }

    public List<Notification> forUser(Long userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markRead(Long id) {
        repo.findById(id).ifPresent(n -> {
            n.setRead(Boolean.TRUE);
            repo.save(n);
        });
    }
}

