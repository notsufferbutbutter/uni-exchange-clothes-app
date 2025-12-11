package com.circular.article;

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
public class ArticleTextSearchIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ArticleRepository articleRepository;

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void textSearch_returnsMatchingArticles_and_canCombineWithType() throws Exception {
        articleRepository.deleteAll();

        Article a1 = new Article();
        a1.setTitle("Red Jacket");
        a1.setSummary("Warm and red");
        a1.setType("jacket");
        articleRepository.save(a1);

        Article a2 = new Article();
        a2.setTitle("Blue Shirt");
        a2.setSummary("Comfortable blue shirt");
        a2.setType("shirt");
        articleRepository.save(a2);

        // search 'red' should match a1
        String res = mockMvc.perform(get("/api/v1/articles/search?q=red").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        Article[] arr = mapper.readValue(res, Article[].class);
        assertThat(arr).hasSize(1);
        assertThat(arr[0].getTitle()).containsIgnoringCase("red");

        // search 'blue' with type=shirt should return a2
        String res2 = mockMvc.perform(get("/api/v1/articles/search?q=blue&type=shirt").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        Article[] arr2 = mapper.readValue(res2, Article[].class);
        assertThat(arr2).hasSize(1);
        assertThat(arr2[0].getType()).isEqualTo("shirt");
    }
}

