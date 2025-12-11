package com.circular.article;

import jakarta.persistence.*;


@Entity
@Table(name = "ARTICLE")
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id; // Primärschlüssel (Muss mit Ihrem DB-Typ übereinstimmen, z.B. Long)


    @Column(name = "TITLE", length = 500)
    private String title;

    @Column(name = "ARTICLE_DATE")
    private String date;

    @Column(name = "AUTHOR")
    private String author;

    @Column(name = "IMAGE")
    private String image;

    @Column(name = "SUMMARY", length = 1000)
    private String summary;

    @Column(name = "LINK")
    private String link;

    // Use safe column names to avoid conflicts with DB reserved words
    @Column(name = "ITEM_TYPE")
    private String type;

    @Column(name = "ITEM_SIZE")
    private String size;

    @Column(name = "ITEM_CONDITION")
    private String condition;

    @Column(name = "AVAILABLE")
    private Boolean available = Boolean.TRUE;


    // JPA requires a no-arg constructor; make it public so tests in other packages can instantiate it
    public Article() {}

    public Article(String title,
                   String date,
                   String author,
                   String image,
                   String summary,
                   String link,
                   String type) {
        this.title = title;
        this.date = date;
        this.author = author;
        this.image = image;
        this.summary = summary;
        this.link = link;
        this.type = type;
        this.available = Boolean.TRUE;
    }

    // Getter und Setter (für den einfachen Prototyp)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }

}
