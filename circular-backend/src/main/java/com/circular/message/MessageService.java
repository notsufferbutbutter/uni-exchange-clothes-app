package com.circular.message;

import com.circular.message.dto.MessageCreateRequest;
import com.circular.message.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import com.circular.notification.NotificationService;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private NotificationService notificationService;

    public MessageResponse send(MessageCreateRequest req) {
        Message m = new Message(req.getSenderId(), req.getRecipientId(), req.getContent());
        Message saved = messageRepository.save(m);
        // create notification for recipient
        notificationService.create(req.getRecipientId(), "MESSAGE", "Neue Nachricht von user " + req.getSenderId());
        return toDto(saved);
    }

    public List<MessageResponse> inboxFor(Long recipientId) {
        return messageRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    private MessageResponse toDto(Message m) {
        return new MessageResponse(m.getId(), m.getSenderId(), m.getRecipientId(), m.getContent(), m.isRead(), m.getCreatedAt());
    }
}
