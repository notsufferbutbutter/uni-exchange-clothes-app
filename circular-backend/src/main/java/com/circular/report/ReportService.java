package com.circular.report;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import com.circular.article.ArticleRepository;

@Service
public class ReportService {

    @Autowired
    private ReportRepository repo;

    @Autowired(required = false)
    private ArticleRepository articleRepository;

    public Report createReport(Long reporterId, String contentType, Long contentId, String reason) {
        Report r = new Report(reporterId, contentType, contentId, reason);
        return repo.save(r);
    }

    public List<Report> listReportsForContent(String contentType) {
        return repo.findByContentTypeOrderByCreatedAtDesc(contentType);
    }

    public List<Report> findByContent(String contentType, Long contentId) {
        return repo.findByContentTypeAndContentId(contentType, contentId);
    }

    public void deleteReport(Long id) {
        repo.deleteById(id);
    }

    public void deleteReportedContent(String contentType, Long contentId) {
        if ("ARTICLE".equalsIgnoreCase(contentType) && articleRepository != null) {
            articleRepository.deleteById(contentId);
        }
        // other content types can be added (e.g., MESSAGE repository)
    }
}
