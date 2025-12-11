package com.circular.report;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@CrossOrigin(origins = "http://localhost:4200")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping
    public ResponseEntity<Report> create(@RequestBody CreateReportRequest req) {
        Report r = reportService.createReport(req.getReporterId(), req.getContentType(), req.getContentId(), req.getReason());
        return ResponseEntity.ok(r);
    }

    @GetMapping("/content/{contentType}")
    public ResponseEntity<List<Report>> listByType(@PathVariable String contentType) {
        return ResponseEntity.ok(reportService.listReportsForContent(contentType));
    }

    @GetMapping("/content/{contentType}/{contentId}")
    public ResponseEntity<List<Report>> listByContent(@PathVariable String contentType, @PathVariable Long contentId) {
        return ResponseEntity.ok(reportService.findByContent(contentType, contentId));
    }
}

