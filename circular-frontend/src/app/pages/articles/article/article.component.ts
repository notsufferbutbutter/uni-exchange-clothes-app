import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import {
  HlmCard,
  HlmCardContent,
  HlmCardDescription,
  HlmCardFooter,
  HlmCardTitle,
} from '@spartan-ng/helm/card';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { ArticleObject } from '../../interfaces/article-object.interface';

@Component({
  selector: 'app-article',
  imports: [
    NgIcon,
    HlmIcon,
    HlmCardContent,
    HlmCard,
    HlmCardTitle,
    HlmCardDescription,
    HlmCardFooter,
    HlmButton,
  ],
  providers: [provideIcons({ lucideChevronRight })],
  host: {
    class: 'w-full',
  },
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticleComponent {
  article = input.required<ArticleObject>();
}
