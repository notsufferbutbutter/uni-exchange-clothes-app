import { Injectable } from "@angular/core";
import { supabase } from "../supabase/superbase-client";
import { Item } from "../pages/interfaces/item.record";

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    async loadAllItems(userId: string) :Promise<Item[]>{
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .neq('owner_id', userId)
            .or('is_archived.is.null,is_archived.eq.false')
            .order('created_at', {ascending: true});
        
        if (error || !data) {
            console.log("Failed at loading all items", error);
            return [];
        }

        const itemsPromise = await Promise.all(data);
        
        // Map item_id to id for consistency with Item interface
        return itemsPromise.map((item: any) => ({
            ...item,
            id: item.item_id
        })) as Item[];
    }

    async loadAllItemsOfUser(userId: string) :Promise<Item[]>{
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .eq('owner_id', userId)
            .or('is_archived.is.null,is_archived.eq.false')
            .order('created_at', {ascending: true});

        if (error || !data) {
            console.log("Failed at loading all item of user");
            return [];
        }

        const itemsPromise = await Promise.all(data);
        
        // Map item_id to id for consistency with Item interface
        return itemsPromise.map((item: any) => ({
            ...item,
            id: item.item_id
        })) as Item[];
    }

    async addNewItem(userId: string, newItem: Partial<Item>) {
        const owner_id = userId;
        const title = newItem.title;
        const description = newItem.description;
        const price = newItem.price;
        const images = newItem.images;
        const category = newItem.category;
        const size = newItem.size;
        const condition = newItem.condition;
        const created_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('items')
            .insert({
                title, description, price, images,
                owner_id, 
                category, size, condition,
                created_at
            })
            .select();

        if (error || !data) {
            console.error("Failed at adding new item:", error);
            return null
        }

        return data;
    }

    async loadItemById(itemId: number): Promise<Item | null> {
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .eq('item_id', itemId)
            .single();

        if (error || !data) {
            console.log("Failed at loading item by id:", itemId, error);
            return null;
        }

        // Map item_id to id for consistency with Item interface
        return {
            ...data,
            id: data.item_id
        } as Item;
    }

    async archiveItem(itemId: number): Promise<boolean> {
        const { error } = await supabase
            .from('items')
            .update({ is_archived: true })
            .eq('item_id', itemId);

        if (error) {
            console.error("Failed to archive item:", itemId, error);
            return false;
        }

        return true;
    }

    async updateItemOfUser(userId: string, itemId: number, updatedItem: Item) {
        const title = updatedItem.title;
        const description = updatedItem.description;
        const price = updatedItem.price;
        const images = updatedItem.images;
        const category = updatedItem.category;
        const size = updatedItem.size;
        const condition = updatedItem.condition;
        const updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('items')
            .update(
                {title, description, price, images, category, size, condition, updated_at}
            )
            .eq('item_id', itemId)
            .eq('owner_id', userId)
            .select();

        if (error || !data) {
            console.log("Failed at updating item: ", itemId);
            return null
        }

        return data;
    }
}