package com.circular.article;

import com.circular.article.dto.ArticleDetailDto;
import com.circular.article.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/articles")
@CrossOrigin(origins = "http://localhost:4200")
public class ArticleController {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ArticleService articleService;

    @GetMapping
    public List<Article> getAll() {
        return articleRepository.findAll();
    }

    @GetMapping("/search")
    public List<Article> search(@RequestParam(required = false) String type,
                                @RequestParam(required = false) String q) {
        // If q provided, perform text search on title/summary
        if (q != null && !q.isBlank()) {
            List<Article> byText = articleRepository.findByTitleContainingIgnoreCaseOrSummaryContainingIgnoreCase(q, q);
            if (type == null || type.isBlank()) {
                return byText;
            }
            // filter by type
            return byText.stream().filter(a -> type.equalsIgnoreCase(a.getType())).collect(Collectors.toList());
        }

        // Fallback: if only type provided
        if (type == null || type.isBlank()) {
            return articleRepository.findAll();
        }
        return articleRepository.findByType(type);
    }

    @GetMapping("/{id}")
    public ArticleDetailDto getById(@PathVariable Long id) {
        return articleService.getArticleDetail(id)
                .orElseThrow(() -> new RuntimeException("Article with id " + id + " not found"));
    }
}
