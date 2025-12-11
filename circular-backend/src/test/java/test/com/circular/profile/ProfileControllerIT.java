package com.circular.profile;

import com.circular.profile.ProfileRepository;
import com.circular.profile.Profile;
import com.circular.profile.dto.ProfileCreateRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ProfileControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void createProfile_shouldReturn201AndLocation_andStorePasswordHash() throws Exception {
        String unique = UUID.randomUUID().toString().substring(0, 8);
        String username = "testuser_" + unique;
        String email = "testuser_" + unique + "@example.com";
        String plainPassword = "secret123";

        com.circular.profile.dto.ProfileCreateRequest req = new com.circular.profile.dto.ProfileCreateRequest();
        req.setUsername(username);
        req.setDisplayName("Test User");
        req.setEmail(email);
        req.setBio("I love swapping clothes");
        req.setAvatarUrl("/img/avatar.png");
        req.setPassword(plainPassword);

        String body = mapper.writeValueAsString(req);

        MvcResult result = mockMvc.perform(post("/api/v1/profiles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", Matchers.containsString("/api/v1/profiles/")))
                .andExpect(jsonPath("$.username").value(username))
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.password").doesNotExist())
                .andReturn();

        // Verify persisted entity and password hash
        Optional<Profile> persisted = profileRepository.findByEmail(email);
        assertThat(persisted).isPresent();
        String storedHash = persisted.get().getPasswordHash();
        assertThat(storedHash).isNotBlank();
        assertThat(passwordEncoder.matches(plainPassword, storedHash)).isTrue();
    }

    @Test
    void createProfile_withShortPassword_shouldReturn400() throws Exception {
        com.circular.profile.dto.ProfileCreateRequest req = new com.circular.profile.dto.ProfileCreateRequest();
        req.setUsername("shortpw");
        req.setEmail("shortpw@example.com");
        req.setPassword("abc");

        String body = mapper.writeValueAsString(req);

        mockMvc.perform(post("/api/v1/profiles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message", Matchers.containsString("password")));
    }

    @Test
    void createProfile_duplicateEmail_shouldReturn409() throws Exception {
        String unique = UUID.randomUUID().toString().substring(0, 8);
        String username1 = "dupuser1_" + unique;
        String email = "dupuser_" + unique + "@example.com";

        com.circular.profile.dto.ProfileCreateRequest req1 = new com.circular.profile.dto.ProfileCreateRequest();
        req1.setUsername(username1);
        req1.setEmail(email);
        req1.setPassword("password1");

        String body1 = mapper.writeValueAsString(req1);

        // create first
        mockMvc.perform(post("/api/v1/profiles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body1))
                .andExpect(status().isCreated());

        // attempt duplicate
        com.circular.profile.dto.ProfileCreateRequest req2 = new com.circular.profile.dto.ProfileCreateRequest();
        req2.setUsername("dupuser2_" + unique);
        req2.setEmail(email); // same email
        req2.setPassword("password2");

        String body2 = mapper.writeValueAsString(req2);

        mockMvc.perform(post("/api/v1/profiles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body2))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));
    }

    @Test
    void createProfile_duplicateUsername_shouldReturn409() throws Exception {
        String unique = UUID.randomUUID().toString().substring(0, 8);
        String username = "dupuser_" + unique;

        com.circular.profile.dto.ProfileCreateRequest req1 = new com.circular.profile.dto.ProfileCreateRequest();
        req1.setUsername(username);
        req1.setEmail(username + "@example.com");
        req1.setPassword("password1");

        String body1 = mapper.writeValueAsString(req1);

        mockMvc.perform(post("/api/v1/profiles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body1))
                .andExpect(status().isCreated());

        com.circular.profile.dto.ProfileCreateRequest req2 = new com.circular.profile.dto.ProfileCreateRequest();
        req2.setUsername(username); // same username
        req2.setEmail(username + "2@example.com");
        req2.setPassword("password2");

        String body2 = mapper.writeValueAsString(req2);

        mockMvc.perform(post("/api/v1/profiles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body2))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));
    }

    @Test
    void createProfile_missingUsername_shouldReturn400_withErrorJson() throws Exception {
        com.circular.profile.dto.ProfileCreateRequest req = new com.circular.profile.dto.ProfileCreateRequest();
        req.setEmail("nouser@example.com");
        req.setPassword("validPass1");

        String body = mapper.writeValueAsString(req);

        mockMvc.perform(post("/api/v1/profiles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message", Matchers.containsString("username is required")));
    }
}
