package com.circular.article;

import com.circular.article.dto.ArticleDetailDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ArticleDetailIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ArticleRepository articleRepository;

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void getArticleDetail_returnsAllFields() throws Exception {
        articleRepository.deleteAll();

        Article a = new Article();
        a.setTitle("Coat 1");
        a.setSummary("Warm coat");
        a.setSize("M");
        a.setCondition("good");
        a.setType("coat");
        a.setAvailable(Boolean.TRUE);
        Article saved = articleRepository.save(a);

        String res = mockMvc.perform(get("/api/v1/articles/" + saved.getId())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        ArticleDetailDto dto = mapper.readValue(res, ArticleDetailDto.class);
        assertThat(dto.getId()).isEqualTo(saved.getId());
        assertThat(dto.getName()).isEqualTo("Coat 1");
        assertThat(dto.getDescription()).isEqualTo("Warm coat");
        assertThat(dto.getSize()).isEqualTo("M");
        assertThat(dto.getCondition()).isEqualTo("good");
        assertThat(dto.getAvailable()).isTrue();
    }
}

