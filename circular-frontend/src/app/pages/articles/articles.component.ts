import { Component, computed, inject, signal } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ArticleComponent } from './article/article.component';
import { HlmNumberedPagination } from '@spartan-ng/helm/pagination';
import { ArticleService } from '../../services/articles.service';

@Component({
  selector: 'app-articles',
  imports: [NavbarComponent, ArticleComponent, HlmNumberedPagination],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css'],
})
export class ArticlesComponent {
  articleService = inject(ArticleService);

  constructor() {
    this.articleService.loadAll();
  }

  readonly allArticles = this.articleService.articles;
  readonly loading = this.articleService.loading;
  readonly error = this.articleService.error;

  public readonly itemsPerPage = signal(5);
  public readonly currentPage = signal(1);
  public readonly pageSize = signal(
    Math.ceil(this.allArticles().length / this.itemsPerPage()),
  );
  public readonly totalArticles = signal(this.allArticles().length);

  public readonly paginatedArticles = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.allArticles().slice(start, end);
  });
}
