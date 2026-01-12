import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TauschangebotComponent } from './tauschangebot.component';
import { TradeRequestService } from '../../services/trade-request.service';
import { UserService } from '../../services/user.service';
import { ItemService } from '../../services/items.service';
import { ChatService } from '../../services/chat.service';


describe('TauschangebotComponent', () => {
  let fixture: ComponentFixture<TauschangebotComponent>;
  let component: TauschangebotComponent;

  const tradeSvc: Partial<TradeRequestService> = {
    getReceivedRequests: jest.fn().mockResolvedValue([
      { id: 1, status: 'PENDING', requestedArticleId: 10, offeredArticleIds: [20], requesterId: 'u2', receiverId: 'u1' },
      { id: 2, status: 'ACCEPTED', requestedArticleId: 11, offeredArticleIds: [21], requesterId: 'u3', receiverId: 'u1' },
    ] as any),
    getSentRequests: jest.fn().mockResolvedValue([
      { id: 3, status: 'PENDING', requestedArticleId: 12, offeredArticleIds: [22], requesterId: 'u1', receiverId: 'u4' },
    ] as any),
    updateStatus: jest.fn().mockResolvedValue(true),
    getPendingRequestsByItemIds: jest.fn().mockResolvedValue([]),
    rejectMultipleRequests: jest.fn().mockResolvedValue(true),
  };

  const itemSvc: Partial<ItemService> = {
    loadItemById: jest.fn().mockResolvedValue({ id: 10 }),
    archiveItem: jest.fn().mockResolvedValue(true),
    loadAllItemsOfUser: jest.fn().mockResolvedValue([]),
  };

  const userSvc: Partial<UserService> = {
    currentProfileUser: () => ({ user_id: 'u1' } as any),
    loadUserByUserId: jest.fn().mockResolvedValue({ user_id: 'u1', username: 'A' }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TauschangebotComponent, RouterTestingModule],
      providers: [
        { provide: TradeRequestService, useValue: tradeSvc },
        { provide: ItemService, useValue: itemSvc },
        { provide: UserService, useValue: userSvc },
        { provide: ChatService, useValue: { unreadMessages: signal(0), countUnreadMessages: jest.fn().mockResolvedValue(0) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TauschangebotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads requests and categorizes them', async () => {
    await component.loadAllRequests();
    expect(tradeSvc.getReceivedRequests).toHaveBeenCalledWith('u1');
    expect(tradeSvc.getSentRequests).toHaveBeenCalledWith('u1');
    expect(component.receivedRequests().map(r => r.id)).toEqual([1]);
    expect(component.successfulTrades().map(r => r.id)).toEqual([2]);
  });

  it('rejects a request and reloads', async () => {
    await component.onReject({ id: 3 } as any);
    expect(tradeSvc.updateStatus).toHaveBeenCalledWith(3, 'REJECTED');
  });
});
