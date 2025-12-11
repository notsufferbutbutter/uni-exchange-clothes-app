import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BrnToggleGroupImports } from '@spartan-ng/brain/toggle-group';

import {
  HlmCard,
  HlmCardContent,
  HlmCardDescription,
  HlmCardFooter,
  HlmCardTitle,
} from '@spartan-ng/helm/card';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
import { Item } from '../../interfaces/item.record';

@Component({
  selector: 'app-closet-item',
  imports: [
    HlmCardContent,
    HlmCard,
    HlmCardTitle,
    HlmCardDescription,
    HlmCardFooter,
    DatePipe,
    HlmAvatarImports,
    BrnToggleGroupImports,
    HlmToggleGroupImports,
  ],
  templateUrl: 'closet-item.component.html'
})
export class ClosetItemComponent {
  item = input.required<Item>();
  isEditClick = output<boolean>();

  onEdit() {
    this.isEditClick.emit(true);
  }
}
