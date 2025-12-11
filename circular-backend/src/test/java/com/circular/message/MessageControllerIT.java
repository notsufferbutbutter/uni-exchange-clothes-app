package com.circular.message;

import com.circular.message.dto.MessageCreateRequest;
import com.circular.message.dto.MessageResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class MessageControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MessageRepository messageRepository;

    private final ObjectMapper mapper = new ObjectMapper();

    public MessageControllerIT() {
        // Register JavaTimeModule so LocalDateTime is supported
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Test
    void sendAndInbox_shouldWork() throws Exception {
        // send message
        MessageCreateRequest req = new MessageCreateRequest();
        req.setSenderId(1L);
        req.setRecipientId(2L);
        req.setContent("Hello, is the item still available?");

        String body = mapper.writeValueAsString(req);

        String resp = mockMvc.perform(post("/api/v1/messages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        MessageResponse created = mapper.readValue(resp, MessageResponse.class);
        assertThat(created.getId()).isNotNull();
        assertThat(created.getRecipientId()).isEqualTo(2L);

        // inbox
        String inboxJson = mockMvc.perform(get("/api/v1/messages/inbox/2"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        List<MessageResponse> inbox = mapper.readValue(inboxJson, mapper.getTypeFactory().constructCollectionType(List.class, MessageResponse.class));
        assertThat(inbox).isNotEmpty();
        assertThat(inbox.get(0).getContent()).isEqualTo("Hello, is the item still available?");
    }
}
