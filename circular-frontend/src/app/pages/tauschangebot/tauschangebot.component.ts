import { Component, effect, inject, signal } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TradeRequest } from '../interfaces/trade-request.record';
import { TradeRequestService } from '../../services/trade-request.service';
import { UserService } from '../../services/user.service';
import { ItemService } from '../../services/items.service';
import { Item } from '../interfaces/item.record';
import { User } from '../interfaces/user.record';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { DatePipe, CommonModule } from '@angular/common';
import {
  HlmCard,
  HlmCardContent,
  HlmCardDescription,
  HlmCardFooter,
  HlmCardHeader,
  HlmCardTitle,
} from '@spartan-ng/helm/card';

@Component({
  selector: 'app-tauschangebot',
  imports: [
    NavbarComponent,
    HlmDialogImports,
    BrnDialogImports,
    HlmButtonImports,
    DatePipe,
    CommonModule,
    HlmCard,
    HlmCardContent,
    HlmCardDescription,
    HlmCardFooter,
    HlmCardHeader,
    HlmCardTitle,
  ],
  templateUrl: './tauschangebot.component.html',
})
export class TauschangebotComponent {
  readonly tradeRequestService = inject(TradeRequestService);
  readonly userService = inject(UserService);
  readonly itemService = inject(ItemService);

  readonly currentUserId = this.userService.currentProfileUser()?.user_id;
  
  public receivedRequests = signal<TradeRequest[]>([]);
  public sentRequests = signal<TradeRequest[]>([]);
  public successfulTrades = signal<TradeRequest[]>([]);
  
  public activeTab = signal<'received' | 'sent' | 'successful'>('received');
  public dialogState = signal<'open' | 'closed'>('closed');
  public selectedRequest = signal<TradeRequest | null>(null);
  public userItems = signal<Item[]>([]);
  public selectedItemForTrade = signal<number | null>(null);
  
  // Item details cache
  public itemsCache = signal<Map<number, Item>>(new Map());
  // User details cache
  public usersCache = signal<Map<string, User>>(new Map());

  constructor() {
    effect(async () => {
      if (!this.currentUserId) return;
      await this.loadAllRequests();
    });
  }

  async loadAllRequests() {
    if (!this.currentUserId) return;

    const received = await this.tradeRequestService.getReceivedRequests(this.currentUserId);
    const sent = await this.tradeRequestService.getSentRequests(this.currentUserId);

    this.receivedRequests.set(received.filter(r => r.status === 'PENDING'));
    this.sentRequests.set(sent);
    this.successfulTrades.set([...received, ...sent].filter(r => r.status === 'ACCEPTED'));

    // Load item details for all requests
    await this.loadItemDetails([...received, ...sent]);
  }

  async loadItemDetails(requests: TradeRequest[]) {
    const cache = this.itemsCache();
    const userCache = this.usersCache();
    const itemIds = new Set<number>();
    const userIds = new Set<string>();

    requests.forEach(req => {
      itemIds.add(req.requestedArticleId);
      req.offeredArticleIds.forEach(id => itemIds.add(id));
      userIds.add(req.requesterId);
      userIds.add(req.receiverId);
    });

    // Load items
    for (const id of itemIds) {
      if (!cache.has(id)) {
        const item = await this.itemService.loadItemById(id);
        if (item) {
          cache.set(id, item);
        }
      }
    }

    // Load users
    for (const userId of userIds) {
      if (!userCache.has(userId)) {
        const user = await this.userService.loadUserByUserId(userId);
        if (user) {
          userCache.set(userId, user as User);
        }
      }
    }

    this.itemsCache.set(new Map(cache));
    this.usersCache.set(new Map(userCache));
  }

  getItem(itemId: number): Item | undefined {
    return this.itemsCache().get(itemId);
  }

  getUser(userId: string): User | undefined {
    return this.usersCache().get(userId);
  }

  async onRespond(request: TradeRequest) {
    if (!this.currentUserId) return;

    this.selectedRequest.set(request);
    const items = await this.itemService.loadAllItemsOfUser(this.currentUserId);
    this.userItems.set(items);
    this.selectedItemForTrade.set(null);
    this.dialogState.set('open');
  }

  selectItemForTrade(itemId: number) {
    this.selectedItemForTrade.set(itemId);
  }

  async onAccept(request: TradeRequest) {
    if (!request || request.offeredArticleIds.length === 0) return;

    // Update trade request status to ACCEPTED
    const success = await this.tradeRequestService.updateStatus(request.id, 'ACCEPTED');
    if (!success) return;

    // Archive all items involved in the trade (requested item + all offered items)
    const itemsToArchive = [request.requestedArticleId, ...request.offeredArticleIds];
    await Promise.all(
      itemsToArchive.map(itemId => this.itemService.archiveItem(itemId))
    );

    // Find all pending trade requests involving these archived items
    const relatedRequests = await this.tradeRequestService.getPendingRequestsByItemIds(itemsToArchive);
    
    // Auto-reject all related trade requests (excluding the current accepted one)
    const requestIdsToReject = relatedRequests
      .filter(r => r.id !== request.id)
      .map(r => r.id);
    
    if (requestIdsToReject.length > 0) {
      await this.tradeRequestService.rejectMultipleRequests(requestIdsToReject);
    }

    // Reload requests to show updated state
    await this.loadAllRequests();
  }

  async onReject(request: TradeRequest) {
    const success = await this.tradeRequestService.updateStatus(request.id, 'REJECTED');
    if (success) {
      await this.loadAllRequests();
    }
  }

  onCancel() {
    this.dialogState.set('closed');
    this.selectedRequest.set(null);
    this.selectedItemForTrade.set(null);
  }

  onDialogStateChange(state: any) {
    this.dialogState.set(state as 'open' | 'closed');
    if (state === 'closed') {
      this.onCancel();
    }
  }
}
