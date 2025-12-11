package com.circular.profile;

import com.circular.profile.dto.ProfileCreateRequest;
import com.circular.profile.dto.ProfileResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ProfileAdminIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProfileRepository profileRepository;

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void banAndDelete_requiresAdminHeader() throws Exception {
        profileRepository.deleteAll();

        // create profile using repository
        Profile p = new Profile("user123", "User", "user123@example.com", "bio", "/img.png");
        p.setPasswordHash("hash");
        Profile saved = profileRepository.save(p);

        // attempt ban without header -> 403
        mockMvc.perform(post("/api/v1/admin/profiles/" + saved.getId() + "/ban"))
                .andExpect(status().isForbidden());

        // ban with header
        mockMvc.perform(post("/api/v1/admin/profiles/" + saved.getId() + "/ban").header("X-ADMIN", "true"))
                .andExpect(status().isOk());

        Profile afterBan = profileRepository.findById(saved.getId()).get();
        assertThat(afterBan.getBanned()).isTrue();

        // delete with header
        mockMvc.perform(delete("/api/v1/admin/profiles/" + saved.getId()).header("X-ADMIN", "true"))
                .andExpect(status().isNoContent());

        assertThat(profileRepository.existsById(saved.getId())).isFalse();
    }
}

