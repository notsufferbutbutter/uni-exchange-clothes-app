import { Component, computed, effect, inject, Input, signal } from '@angular/core';
import { HlmAutocomplete } from '@spartan-ng/helm/autocomplete';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Item } from '../interfaces/item.record';
import { MarketplaceItemComponent } from './marketplace-item/marketplace-item.component';
import { ItemService } from '../../services/items.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-marketplace',
  imports: [HlmAutocomplete, NavbarComponent, MarketplaceItemComponent],
  templateUrl: './marketplace.component.html',
})
export class MarketplaceComponent {
  readonly itemService = inject(ItemService);
  readonly _items = signal<Item[]>([]);
  readonly userService = inject(UserService);
  readonly route = inject(ActivatedRoute);
  readonly categoryFilter = signal<string | null>(null);

  constructor() {
    effect(async() => {
      const userId = this.userService.currentProfileUser()?.user_id;
      if(!userId) return;
      const data = await this.itemService.loadAllItems(userId);
      this._items.set(data);
    });

    // Listen to query params for category filter
    effect(() => {
      this.route.queryParams.subscribe(params => {
        this.categoryFilter.set(params['category'] || null);
      });
    });
  }

    

  public readonly search = signal('');
  public transformOptionToString = (item: Item) => item.title;

  public filteredOptions = computed<Item[]>(() => {
    let filtered = this._items();

    // Filter by search text
    if (this.search()) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(this.search().toLowerCase())
      );
    }

    // Filter by category
    if (this.categoryFilter()) {
      const category = this.categoryFilter()?.toLowerCase();
      filtered = filtered.filter((item) => {
        return category === item.category?.toLowerCase();
      });
    }

    return filtered;
  });
}
