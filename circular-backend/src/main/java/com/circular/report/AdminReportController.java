package com.circular.report;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/reports")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminReportController {

    @Autowired
    private ReportService reportService;

    private void ensureAdmin(String adminHeader) {
        if (adminHeader == null || !adminHeader.equalsIgnoreCase("true")) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.FORBIDDEN, "Admin privileges required");
        }
    }

    @GetMapping
    public ResponseEntity<List<Report>> allReports(@RequestHeader(value = "X-ADMIN", required = false) String adminHeader) {
        ensureAdmin(adminHeader);
        return ResponseEntity.ok(reportService.listReportsForContent("ARTICLE"));
    }

    @DeleteMapping("/{id}/content")
    public ResponseEntity<Void> deleteReportedContent(@PathVariable Long id, @RequestHeader(value = "X-ADMIN", required = false) String adminHeader) {
        ensureAdmin(adminHeader);
        Report r = reportService.findByContent("ARTICLE", id).stream().findFirst().orElse(null);
        if (r != null) {
            reportService.deleteReportedContent(r.getContentType(), r.getContentId());
            reportService.deleteReport(r.getId());
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long reportId, @RequestHeader(value = "X-ADMIN", required = false) String adminHeader) {
        ensureAdmin(adminHeader);
        reportService.deleteReport(reportId);
        return ResponseEntity.noContent().build();
    }
}

