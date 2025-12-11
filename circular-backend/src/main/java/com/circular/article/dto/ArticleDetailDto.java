package com.circular.article.dto;

import java.util.List;

public class ArticleDetailDto {
    private Long id;
    private String name;
    private List<String> images;
    private String description;
    private String size;
    private String condition;
    private Boolean available;

    public ArticleDetailDto() {}

    public ArticleDetailDto(Long id, String name, List<String> images, String description, String size, String condition, Boolean available) {
        this.id = id;
        this.name = name;
        this.images = images;
        this.description = description;
        this.size = size;
        this.condition = condition;
        this.available = available;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }
}
