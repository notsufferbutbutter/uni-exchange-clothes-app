package com.circular.message;

import com.circular.message.dto.MessageCreateRequest;
import com.circular.message.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
@CrossOrigin(origins = "http://localhost:4200")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(@RequestBody MessageCreateRequest req, UriComponentsBuilder ucb) {
        MessageResponse created = messageService.send(req);
        URI location = ucb.path("/api/v1/messages/{id}").buildAndExpand(created.getId()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @GetMapping("/inbox/{recipientId}")
    public List<MessageResponse> inbox(@PathVariable Long recipientId) {
        return messageService.inboxFor(recipientId);
    }
}
