package com.circular.report;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByContentTypeAndContentId(String contentType, Long contentId);
    List<Report> findByContentTypeOrderByCreatedAtDesc(String contentType);
}

