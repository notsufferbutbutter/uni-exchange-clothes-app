package com.circular.profile;

import com.circular.profile.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/admin/profiles")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminProfileController {

    @Autowired
    private ProfileService profileService;

    private void ensureAdmin(String adminHeader) {
        if (adminHeader == null || !adminHeader.equalsIgnoreCase("true")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin privileges required");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, @RequestHeader(value = "X-ADMIN", required = false) String adminHeader) {
        ensureAdmin(adminHeader);
        profileService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/ban")
    public ResponseEntity<Void> banUser(@PathVariable Long id, @RequestHeader(value = "X-ADMIN", required = false) String adminHeader) {
        ensureAdmin(adminHeader);
        profileService.banUser(id);
        return ResponseEntity.ok().build();
    }
}
