package com.circular.article;

import com.circular.article.Article;
import com.circular.article.ArticleRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class ArticleRepositoryTest {

    @Autowired
    private ArticleRepository articleRepository;

    @Test
    void saveAndFindById() {
        // Arrange
        Article a = new Article();
        a.setTitle("Test Title");
        a.setDate("2025-11-29");
        a.setAuthor("Unit Tester");
        a.setImage("/img/test.png");
        a.setSummary("This is a summary");
        a.setLink("http://example.com");
        a.setType("news");

        // Act
        Article saved = articleRepository.save(a);

        // Assert
        Optional<Article> found = articleRepository.findById(saved.getId());
        assertThat(found).isPresent();
        Article f = found.get();
        assertThat(f.getTitle()).isEqualTo("Test Title");
        assertThat(f.getAuthor()).isEqualTo("Unit Tester");
    }
}
