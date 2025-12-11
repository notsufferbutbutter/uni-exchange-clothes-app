package com.circular.profile;

import com.circular.profile.dto.ProfileCreateRequest;
import com.circular.profile.dto.ProfileResponse;
import com.circular.profile.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/profiles")
@CrossOrigin(origins = "http://localhost:4200")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @PostMapping
    public ResponseEntity<ProfileResponse> createProfile(@RequestBody ProfileCreateRequest req, UriComponentsBuilder ucb) {
        ProfileResponse created = profileService.createProfile(req);
        URI location = ucb.path("/api/v1/profiles/{id}").buildAndExpand(created.getId()).toUri();
        return ResponseEntity.created(location).body(created);
    }
}
