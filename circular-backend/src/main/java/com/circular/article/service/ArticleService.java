package com.circular.article.service;

import com.circular.article.Article;
import com.circular.article.ArticleRepository;
import com.circular.article.dto.ArticleDetailDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    public Optional<ArticleDetailDto> getArticleDetail(Long id) {
        Optional<Article> oa = articleRepository.findById(id);
        return oa.map(this::mapToDto);
    }

    private ArticleDetailDto mapToDto(Article a) {
        List<String> images = (a.getImage() == null || a.getImage().isBlank()) ? List.of() : Arrays.stream(a.getImage().split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        return new ArticleDetailDto(
                a.getId(),
                a.getTitle(),
                images,
                a.getSummary(),
                a.getSize(),
                a.getCondition(),
                a.getAvailable()
        );
    }
}
