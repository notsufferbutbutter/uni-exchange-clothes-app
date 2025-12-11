import { Component, computed, input, signal } from '@angular/core';
import { HlmCard } from '@spartan-ng/helm/card';
import Autoplay from 'embla-carousel-autoplay';

import {
  HlmCarousel,
  HlmCarouselContent,
  HlmCarouselItem,
  HlmCarouselNext,
  HlmCarouselPrevious,
} from '@spartan-ng/helm/carousel';
import { ArticleObject } from '../interfaces/article-object.interface';
import { HeadlineComponent } from './headline/headline.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-headlines',
  imports: [
    RouterLink,
    HlmCarousel,
    HlmCarouselContent,
    HlmCarouselItem,
    HlmCarouselNext,
    HlmCarouselPrevious,
    HlmCard,
    HeadlineComponent,
  ],
  templateUrl: './headlines.component.html',
  styleUrls: ['./headlines.component.css'],
})
export class HeadlinesComponent {
  headlines = input.required<ArticleObject[]>();
  public plugins = [Autoplay({ delay: 3500 })];

  currentHeadline = signal<number>(1);
  headlinesTotal = computed(() => this.headlines().length);

  next() {
    if (this.currentHeadline() < this.headlinesTotal()) {
      this.currentHeadline.update((i) => i + 1);
    } else {
      this.currentHeadline.set(1);
    }
  }

  prev() {
    if (this.currentHeadline() >= 2) {
      this.currentHeadline.update((i) => i - 1);
    } else {
      this.currentHeadline.set(this.headlinesTotal());
    }
  }
}
