import { Injectable, signal } from '@angular/core';
import { Item } from '../pages/interfaces/item.record';
import { supabase } from '../supabase/superbase-client';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  favourites = signal<Item[]>([]);
  private favoriteItemIds = signal<Set<number>>(new Set());

  async loadFavorites(userId: string): Promise<void> {
    const { data, error } = await supabase
      .from('favourites')
      .select('item_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to load favorites:', error);
      return;
    }

    const itemIds = new Set(data.map((fav: any) => fav.item_id));
    this.favoriteItemIds.set(itemIds);

    // Load full item details for favorites
    if (itemIds.size > 0) {
      const { data: items, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .in('item_id', Array.from(itemIds));

      if (itemsError) {
        console.error('Failed to load favorite items:', error);
        return;
      }

      const mappedItems = items?.map((item: any) => ({
        ...item,
        id: item.item_id
      })) as Item[];

      this.favourites.set(mappedItems || []);
    } else {
      this.favourites.set([]);
    }
  }

  async addFavorite(userId: string, itemId: number): Promise<boolean> {
    const { error } = await supabase
      .from('favourites')
      .insert({
        user_id: userId,
        item_id: itemId,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Failed to add favorite:', error);
      return false;
    }

    // Update local state
    this.favoriteItemIds.update(ids => {
      const newIds = new Set(ids);
      newIds.add(itemId);
      return newIds;
    });

    // Reload favorites to update the list
    await this.loadFavorites(userId);
    return true;
  }

  async removeFavorite(userId: string, itemId: number): Promise<boolean> {
    const { error } = await supabase
      .from('favourites')
      .delete()
      .eq('user_id', userId)
      .eq('item_id', itemId);

    if (error) {
      console.error('Failed to remove favorite:', error);
      return false;
    }

    // Update local state
    this.favoriteItemIds.update(ids => {
      const newIds = new Set(ids);
      newIds.delete(itemId);
      return newIds;
    });

    // Update favorites list
    this.favourites.update(favs => favs.filter(item => item.id !== itemId));
    return true;
  }

  async toggleFavorite(userId: string, itemId: number): Promise<boolean> {
    const isFavorite = this.isItemFavorite(itemId);
    
    if (isFavorite) {
      return await this.removeFavorite(userId, itemId);
    } else {
      return await this.addFavorite(userId, itemId);
    }
  }

  isItemFavorite(itemId: number): boolean {
    return this.favoriteItemIds().has(itemId);
  }
}