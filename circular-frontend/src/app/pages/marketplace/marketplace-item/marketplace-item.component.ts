import { Component, input, model, ModelSignal, signal, effect, inject } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHeart, lucideMessagesSquare } from '@ng-icons/lucide';
import { BrnToggleGroupImports } from '@spartan-ng/brain/toggle-group';
import { HlmButton, HlmButtonImports } from '@spartan-ng/helm/button';
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
import { FavoritesService } from '../../../services/favorites.service';
import { HlmToggleImports } from '@spartan-ng/helm/toggle';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { TradeRequestService } from '../../../services/trade-request.service';
import { UserService } from '../../../services/user.service';
import { ItemService } from '../../../services/items.service';
import { ChatService } from '../../../services/chat.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-marketplace-item',
  imports: [
    NgIcon,
    HlmCardContent,
    HlmCard,
    HlmCardTitle,
    HlmCardDescription,
    HlmCardFooter,
    HlmButton,
    HlmButtonImports,
    DatePipe,
    CommonModule,
    HlmAvatarImports,
    HlmToggleImports,
    BrnToggleGroupImports,
    HlmDialogImports,
    BrnDialogImports,
    ReactiveFormsModule,
    HlmInputImports,
    HlmLabelImports,
  ],
  providers: [provideIcons({ lucideHeart, lucideMessagesSquare })],
  template: `
    <section hlmCard class="px-2 py-2">
      <div class="group overflow-hidden rounded-t-md h-[250px]">
        <img
          [src]="item().images[0]"
          alt="Product image"
          class="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>

      <div hlmCardContent class="flex flex-col gap-1 py-1 items items-center">
        <h3 hlmCardTitle>{{ item().title }}</h3>
        <p hlmCardDescription>Condition: {{ item().condition }}</p>
        <p hlmCardDescription>Size: {{ item().size }}</p>
        <p hlmCardDescription>Estimated Price: {{ item().price }} €</p>
        <p hlmCardDescription>
          Created at: {{ item().created_at | date: 'mediumDate' }}
        </p>
      </div>

      <div hlmCardFooter class="flex justify-between pt-0">
        <hlm-avatar>
          <img
            [src]="item().owner?.avatarUrl"
            alt="user profile"
            hlmAvatarImage
          />
          <span class="text-white bg-destructive" hlmAvatarFallback>{{
            item().owner?.username
          }}</span>
        </hlm-avatar>

        <button
          (click)="openTradeDialog()"
          class="
					self-stretch rounded-full 
					flex items-center 
					py-2
					px-4
					border border-black
					hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground
          cursor-pointer"
        >
          <div
            class="
					text-sm"
          >
            Tausch anfragen
          </div>
        </button>

        <div class="flex gap-3">
          <button
            brnToggleGroupItem
            [state]="isItemFavorite() ? 'on' : 'off'"
            (stateChange)="onToggle($event)"
            size="sm"
            variant="outline"
            aria-label="Toggle heart"
            class="flex items-center data-[state=on]:bg-transparent data-[state=on]:*:[ng-icon]:*:[svg]:fill-red-500 data-[state=on]:*:[ng-icon]:*:[svg]:stroke-red-500"
          >
            <ng-icon name="lucideHeart" size="20" />
          </button>          <button hlmBtn size="sm" class="flex items-center justify-center">
            <ng-icon name="lucideMessagesSquare" size="20" />
          </button>
        </div>
      </div>
    </section>

    <!-- Trade Request Dialog -->
    <hlm-dialog [state]="dialogState()" (stateChange)="onDialogStateChange($event)">
      <hlm-dialog-content class="max-w-2xl" *brnDialogContent="let ctx">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Tauschangebot erstellen</h3>
          <p hlmDialogDescription>
            Wähle ein oder mehrere Items aus deinem Schrank zum Tauschen
          </p>
        </hlm-dialog-header>

        <div class="py-4">
          <p class="mb-4 font-semibold">Du möchtest:</p>
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded mb-6">
            <img
              [src]="item().images.length ? item().images[0] : 'https://github.com/shadcn.png'"
              alt="{{ item().title }}"
              class="w-24 h-24 object-cover rounded"
            />
            <div>
              <p class="font-semibold">{{ item().title }}</p>
              <p class="text-sm text-gray-600">Größe: {{ item().size }}</p>
              <p class="text-sm text-gray-600">Zustand: {{ item().condition }}</p>
            </div>
          </div>

          <form [formGroup]="tradeForm">
            <div class="space-y-4">
              <div>
                <label hlmLabel class="mb-2 block">Nachricht (optional)</label>
                <textarea
                  hlmInput
                  formControlName="message"
                  placeholder="Schreibe eine Nachricht..."
                  class="w-full min-h-[100px]"
                ></textarea>
              </div>

              <div>
                <label hlmLabel class="mb-3 block font-semibold">
                  Wähle Items aus deinem Schrank:
                </label>
                <div class="max-h-50 overflow-y-auto space-y-2">
                  @if (userItems().length === 0) {
                    <p class="text-sm text-gray-500 text-center py-8">
                      Du hast noch keine Items in deinem Schrank. Füge zuerst Items hinzu.
                    </p>
                  }
                  @for (userItem of userItems(); track userItem.id || $index) {
                    <div
                      class="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50 transition"
                      [class.border-[#8B9A7E]]="isItemSelected(userItem.id)"
                      [class.bg-green-50]="isItemSelected(userItem.id)"
                      (click)="toggleItemSelection(userItem.id, $event)"
                    >
                      <img
                        [src]="userItem.images[0]"
                        alt="{{ userItem.title }}"
                        class="w-16 h-16 object-cover rounded"
                      />
                      <div class="flex-1">
                        <p class="font-medium">{{ userItem.title }}</p>
                        <p class="text-sm text-gray-600">Größe: {{ userItem.size }}</p>
                      </div>
                      @if (isItemSelected(userItem.id)) {
                        <svg class="w-6 h-6 text-[#8B9A7E]" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>
          </form>
        </div>

        <hlm-dialog-footer class="flex justify-end gap-3">
          <button hlmBtn variant="outline" type="button" (click)="onCancel()">
            Abbrechen
          </button>
          <button
            hlmBtn
            class="bg-[#8B9A7E]"
            [disabled]="selectedItemIds().length === 0 || isSubmitting()"
            (click)="onSubmitTradeRequest()"
          >
            {{ isSubmitting() ? 'Wird gesendet...' : 'Anfrage senden' }}
          </button>
        </hlm-dialog-footer>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class MarketplaceItemComponent {
  item = input.required<Item>();

  readonly tradeRequestService = inject(TradeRequestService);
  readonly userService = inject(UserService);
  readonly itemService = inject(ItemService);
  readonly chatService = inject(ChatService);
  readonly router = inject(Router);

  public dialogState = signal<'open' | 'closed'>('closed');
  public userItems = signal<Item[]>([]);
  public selectedItemIds = signal<number[]>([]);
  public isSubmitting = signal(false);

  public tradeForm = new FormGroup({
    message: new FormControl(''),
  });

  constructor(private favoritesService: FavoritesService) {
    effect(async () => {
      if (this.dialogState() === 'open') {
        await this.loadUserItems();
      }
    });

    // Load favorites on init
    effect(async () => {
      const currentUserId = this.userService.currentProfileUser()?.user_id;
      if (currentUserId) {
        await this.favoritesService.loadFavorites(currentUserId);
      }
    });
  }
  
  async onToggle(state: "on" | "off"): Promise<void> {
    const currentUserId = this.userService.currentProfileUser()?.user_id;
    if (!currentUserId) return;

    await this.favoritesService.toggleFavorite(currentUserId, this.item().id);
  }

  isItemFavorite(): boolean {
    return this.favoritesService.isItemFavorite(this.item().id);
  }

  openTradeDialog() {
    this.dialogState.set('open');
  }

  async loadUserItems() {
    const currentUserId = this.userService.currentProfileUser()?.user_id;
    if (!currentUserId) return;

    const items = await this.itemService.loadAllItemsOfUser(currentUserId);
    this.userItems.set(items);
  }

  toggleItemSelection(itemId: number, event?: Event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    const current = this.selectedItemIds();
    if (current.includes(itemId)) {
      this.selectedItemIds.set(current.filter(id => id !== itemId));
    } else {
      this.selectedItemIds.set([...current, itemId]);
    }
  }

  isItemSelected(itemId: number): boolean {
    return this.selectedItemIds().includes(itemId);
  }

  async onSubmitTradeRequest() {
    const currentUserId = this.userService.currentProfileUser()?.user_id;
    const itemOwnerId = this.item().owner_id;
    const requestedItemId = this.item().id;

    if (!currentUserId || !itemOwnerId || !requestedItemId) {
      console.error('Missing required IDs for trade request', { currentUserId, itemOwnerId, requestedItemId });
      return;
    }

    this.isSubmitting.set(true);

    try {
      // 1. Send images of selected items to chat
      const selectedItems = this.userItems().filter(item => this.selectedItemIds().includes(item.id));
      
      for (const selectedItem of selectedItems) {
        const imageUrl = selectedItem.images.length ? selectedItem.images[0] : '';
        const itemMessage = `🔄 Tauschangebot: ${selectedItem.title}\n${imageUrl}`;
        await this.chatService.addNewMessageWithCurrentPartner(currentUserId, itemOwnerId, itemMessage);
      }

      // 2. Send user's message if provided
      const userMessage = this.tradeForm.value.message?.trim();
      if (userMessage) {
        await this.chatService.addNewMessageWithCurrentPartner(currentUserId, itemOwnerId, userMessage);
      }

      // 3. Create trade request (status: PENDING)
      const result = await this.tradeRequestService.createTradeRequest({
        requesterId: currentUserId,
        receiverId: itemOwnerId,
        requestedArticleId: requestedItemId,
        offeredArticleIds: this.selectedItemIds(),
        message: userMessage || '',
      });

      this.isSubmitting.set(false);

      if (result) {
        this.dialogState.set('closed');
        this.onCancel();
        
        // Navigate to chat
        this.router.navigate(['/chat']);
        alert('Tauschangebot gesendet! Die Konversation wurde im Chat geöffnet.');
      } else {
        alert('Fehler beim Senden des Tauschangebots. Bitte versuche es erneut.');
      }
    } catch (error) {
      console.error('Error creating trade request:', error);
      this.isSubmitting.set(false);
      alert('Fehler beim Senden des Tauschangebots. Bitte versuche es erneut.');
    }
  }

  onCancel() {
    this.selectedItemIds.set([]);
    this.tradeForm.reset();
  }

  onDialogStateChange(state: any) {
    this.dialogState.set(state as 'open' | 'closed');
    if (state === 'closed') {
      this.onCancel();
    }
  }
}
