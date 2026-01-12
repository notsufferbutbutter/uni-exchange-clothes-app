import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { MarketplaceComponent } from './marketplace.component';
import { ItemService } from '../../services/items.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';


describe('MarketplaceComponent', () => {
  let fixture: ComponentFixture<MarketplaceComponent>;
  let component: MarketplaceComponent;

  const items = [
    { id: 1, title: 'Blue Jacket', category: 'jacken', price: 20 },
    { id: 2, title: 'Red Shirt', category: 'hemden', price: 10 },
  ] as any[];

  const itemSvc: Partial<ItemService> = {
    loadAllItems: jest.fn().mockResolvedValue(items),
  };

  const userSvc: Partial<UserService> = {
    currentProfileUser: () => ({ user_id: 'u1' } as any),
  };

  const qp$ = new BehaviorSubject<Record<string, string | undefined>>({});
  const routeStub = { queryParams: qp$.asObservable() } as any as ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketplaceComponent, RouterTestingModule],
      providers: [
        { provide: ItemService, useValue: itemSvc },
        { provide: UserService, useValue: userSvc },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: ChatService, useValue: { unreadMessages: signal(0), countUnreadMessages: jest.fn().mockResolvedValue(0) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters by search text', async () => {
    await Promise.resolve();
    component.search.set('blue');
    const result = component.filteredOptions();
    expect(result.map(i => i.title)).toEqual(['Blue Jacket']);
  });

  it('filters by category from query param', async () => {
    await Promise.resolve();
    qp$.next({ category: 'hemden' });
    // let effect run
    await Promise.resolve();
    const result = component.filteredOptions();
    expect(result.map(i => i.title)).toEqual(['Red Shirt']);
  });
});
