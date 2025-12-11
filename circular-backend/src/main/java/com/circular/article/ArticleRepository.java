package com.circular.article;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long>, JpaSpecificationExecutor<Article> {
    List<Article> findByType(String type);

    // Simple text search (title OR summary) case-insensitive
    List<Article> findByTitleContainingIgnoreCaseOrSummaryContainingIgnoreCase(String title, String summary);
}
