package com.circular.profile.service;

import com.circular.profile.Profile;
import com.circular.profile.ProfileRepository;
import com.circular.profile.dto.ProfileCreateRequest;
import com.circular.profile.dto.ProfileResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public ProfileService(ProfileRepository profileRepository, PasswordEncoder passwordEncoder) {
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public ProfileResponse createProfile(ProfileCreateRequest req) {
        // Simple validations
        if (req.getUsername() == null || req.getUsername().isBlank()) {
            throw new IllegalArgumentException("username is required");
        }
        if (req.getEmail() == null || req.getEmail().isBlank()) {
            throw new IllegalArgumentException("email is required");
        }
        if (req.getPassword() == null || req.getPassword().length() < 6) {
            throw new IllegalArgumentException("password must be at least 6 characters");
        }

        Optional<Profile> byUsername = profileRepository.findByUsername(req.getUsername());
        if (byUsername.isPresent()) {
            throw new IllegalStateException("username already exists");
        }

        Optional<Profile> byEmail = profileRepository.findByEmail(req.getEmail());
        if (byEmail.isPresent()) {
            throw new IllegalStateException("email already exists");
        }

        Profile p = new Profile(req.getUsername(), req.getDisplayName(), req.getEmail(), req.getBio(), req.getAvatarUrl());
        p.setCreatedAt(LocalDateTime.now());

        // Hash password
        String hashed = passwordEncoder.encode(req.getPassword());
        p.setPasswordHash(hashed);

        try {
            Profile saved = profileRepository.save(p);

            return new ProfileResponse(
                    saved.getId(),
                    saved.getUsername(),
                    saved.getDisplayName(),
                    saved.getEmail(),
                    saved.getBio(),
                    saved.getAvatarUrl(),
                    saved.getCreatedAt()
            );
        } catch (DataIntegrityViolationException ex) {
            // Re-throw for ApiExceptionHandler to map to 409
            throw ex;
        }
    }

    @Transactional
    public void banUser(Long id) {
        Profile p = profileRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Profile not found"));
        p.setBanned(Boolean.TRUE);
        profileRepository.save(p);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!profileRepository.existsById(id)) {
            throw new IllegalArgumentException("Profile not found");
        }
        profileRepository.deleteById(id);
    }
}
