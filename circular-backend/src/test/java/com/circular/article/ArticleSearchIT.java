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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ArticleSearchIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ArticleRepository articleRepository;

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void searchByType_returnsMatchingArticles() throws Exception {
        // cleanup
        articleRepository.deleteAll();

        Article a1 = new Article();
        a1.setTitle("Jacket 1");
        a1.setType("jacket");
        articleRepository.save(a1);

        Article a2 = new Article();
        a2.setTitle("Shirt 1");
        a2.setType("shirt");
        articleRepository.save(a2);

        String res = mockMvc.perform(get("/api/v1/articles/search?type=jacket")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        Article[] arr = mapper.readValue(res, Article[].class);
        assertThat(arr).hasSize(1);
        assertThat(arr[0].getType()).isEqualTo("jacket");
    }
}

