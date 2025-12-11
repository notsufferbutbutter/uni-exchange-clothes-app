package com.circular.profile;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "PROFILE")
@SequenceGenerator(name = "profile_seq", sequenceName = "PROFILE_SEQ", allocationSize = 1)
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "profile_seq")
    @Column(name = "ID")
    private Long id;

    @Column(name = "USERNAME", nullable = false, unique = true)
    private String username;

    @Column(name = "DISPLAY_NAME")
    private String displayName;

    @Column(name = "EMAIL", nullable = false, unique = true)
    private String email;

    @Column(name = "BIO", length = 2000)
    private String bio;

    @Column(name = "AVATAR_URL")
    private String avatarUrl;

    @Column(name = "PASSWORD_HASH", nullable = false)
    private String passwordHash;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "BANNED")
    private Boolean banned = Boolean.FALSE;

    protected Profile() {}

    public Profile(String username, String displayName, String email, String bio, String avatarUrl) {
        this.username = username;
        this.displayName = displayName;
        this.email = email;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
        this.createdAt = LocalDateTime.now();
        this.banned = Boolean.FALSE;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Boolean getBanned() { return banned; }
    public void setBanned(Boolean banned) { this.banned = banned; }
}
