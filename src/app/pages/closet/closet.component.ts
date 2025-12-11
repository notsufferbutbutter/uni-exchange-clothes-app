import { Component, effect, inject, signal } from '@angular/core';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmFieldGroup, HlmFieldLabel, HlmField } from '@spartan-ng/helm/field';
import { HlmInput, HlmInputImports } from "@spartan-ng/helm/input";
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { ClosetItemComponent } from './closet-item/closet-item.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Item } from '../interfaces/item.record';
import { ItemService } from '../../services/items.service';
import { supabase } from '../../supabase/superbase-client';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-closet',
  imports: [
    ClosetItemComponent, 
    HlmFieldGroup, HlmFieldLabel, HlmInput, HlmField, BrnSelectImports, HlmSelectImports, 
    ReactiveFormsModule,
    BrnDialogImports, HlmDialogImports, HlmLabelImports, HlmInputImports, HlmButtonImports,
    NavbarComponent
  ],
  templateUrl: './closet.component.html',
})
export class ClosetComponent {
  private readonly _fb = inject(FormBuilder);
  readonly itemService = inject(ItemService);
  readonly userService = inject(UserService);
  readonly currentUserId = this.userService.currentProfileUser()?.user_id;

  public addItemForm = this._fb.group(
    {
      name: ['', Validators.required],
      brand: ['', Validators.required],
      category: ['', Validators.required],
      size: ['', Validators.required],
      condition: ['', Validators.required],
      color: ['', Validators.required],
      description: ['', Validators.required],
      images: [null, Validators.required],
      price: ['', Validators.required]
    }
  )

  public items = signal<Item[]>([]);
  public editingItem = signal<Item | null>(null);
  public dialogState = signal<'open' | 'closed'>('closed');

  // Files selected in the UI, uploaded only on save
  private selectedFiles: File[] = [];
  selectedImageUrls: string[] = [];

  constructor() {
    effect(async() => {
      if(!this.currentUserId) return;
      const data = await this.itemService.loadAllItemsOfUser(this.currentUserId);
      this.items.set(data);
    })
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.selectedFiles = Array.from(input.files);
  }


  private async uploadSelectedFilesToStorage(): Promise<string[]> {
    if (!this.selectedFiles.length) {
      return this.selectedImageUrls;
    }

    const urls: string[] = [];

    for (const file of this.selectedFiles) {
      const filePath = `public/item_${Date.now()}_${file.name}`;

      const { error } = await supabase.storage
        .from('clothes_files')
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading file', error);
        continue;
      }

      const { data: publicData } = supabase.storage
        .from('clothes_files')
        .getPublicUrl(filePath);

      if (publicData?.publicUrl) {
        urls.push(publicData.publicUrl);
      }
    }

    this.selectedFiles = [];
    return urls;
  }

  async onSave() { 
    if (this.addItemForm.invalid || !this.currentUserId) return;

    this.dialogState.set('closed');


    const raw = this.addItemForm.value;
    const uploadedUrls = await this.uploadSelectedFilesToStorage();
    
    // Use uploaded URLs if available, otherwise keep existing images for edits or use fallback for new items
    if (uploadedUrls.length > 0) {
      this.selectedImageUrls = uploadedUrls;
    } else if (!this.editingItem()) {
      // Only use fallback for new items without uploads
      this.selectedImageUrls = ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f'];
    }
    // else: keep this.selectedImageUrls as is (existing images for edits)
    
    console.log('Final URLs:', this.selectedImageUrls);

    const itemData = {
      title: raw.name,
      description: raw.description,
      price: Number(raw.price),
      images: this.selectedImageUrls,
      category: raw.category,
      size: raw.size,
      condition: raw.condition,
    } as Partial<Item>; 

    console.log(itemData);

    if (this.editingItem()) {
      const current = this.editingItem()!;
      const updatedItem: Item = {
        ...current,
        title: raw.name || current.title,
        description: raw.description || current.description,
        price: raw.price ? Number(raw.price) : current.price,
        images: this.selectedImageUrls,
        category: raw.category ? raw.category : current.category,
        size: raw.size ? raw.size : current.size,
        condition: raw.condition ? raw.condition : current.condition,
        updated_at: new Date().toISOString()
      };

      await this.itemService.updateItemOfUser(this.currentUserId, current.id, updatedItem);
      this.items.update(items => items.map(i => i.id === current.id ? updatedItem : i));
    } else {
      const newItem = await this.itemService.addNewItem(this.currentUserId, itemData);
      if (newItem && newItem.length > 0) {
        this.items.update(items => [...items, newItem[0] as Item]);
      }
      console.log(newItem);
    }

    this.addItemForm.reset();
    this.editingItem.set(null);
    this.selectedImageUrls = [];
  }

  onEdit(item: Item) {
    this.editingItem.set(item);
    this.selectedImageUrls = item.images || [];
    
    this.addItemForm.patchValue({
      name: item.title,
      brand: '',
      category: item.category,
      size: item.size,
      condition: item.condition,
      color: '',
      description: item.description,
      price: item.price?.toString(),
      images: null
    });

    // Remove image validation for editing since item already has images
    if (this.selectedImageUrls.length > 0) {
      this.addItemForm.controls.images.removeValidators(Validators.required);
      this.addItemForm.controls.images.updateValueAndValidity();
    }

    this.dialogState.set('open');
  }

  onAddArticle() {
      this.editingItem.set(null);
      this.addItemForm.reset();
      this.selectedFiles = [];
      this.selectedImageUrls = [];
      
      // Restore image validation for new items
      this.addItemForm.controls.images.addValidators(Validators.required);
      this.addItemForm.controls.images.updateValueAndValidity();
      
      this.dialogState.set('open');
  }


  hasUnsavedChanges(): boolean {
      if (!this.editingItem()) return true;
      
      const current = this.editingItem()!;
      const form = this.addItemForm.value;

      if (form.name !== current.title) return true;
      if (form.description !== current.description) return true;
      if (Number(form.price) !== current.price) return true;
      
      if (JSON.stringify(this.selectedImageUrls) !== JSON.stringify(current.images)) return true;

      if (form.category !== current.category) return true;
      if (form.size !== current.size) return true;
      if (form.condition !== current.condition) return true;

      return false;
  }

  onDialogStateChange(state: any) {
    this.dialogState.set(state as 'open' | 'closed');
    if (state === 'closed') {
      this.onCancel(); 
    }
  }

  onCancel() {
    this.dialogState.set('closed');
    this.addItemForm.reset();
    this.editingItem.set(null);
    this.selectedFiles = [];
    this.selectedImageUrls = [];
  }
}
