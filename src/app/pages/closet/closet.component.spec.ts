import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { signal } from '@angular/core';
import { ClosetComponent } from './closet.component';
import { ItemService } from '../../services/items.service';
import { UserService } from '../../services/user.service';
import { ChatService } from '../../services/chat.service';


describe('ClosetComponent', () => {
  let fixture: ComponentFixture<ClosetComponent>;
  let component: ClosetComponent;

  const itemSvc: Partial<ItemService> = {
    loadAllItemsOfUser: jest.fn().mockResolvedValue([]),
    addNewItem: jest.fn(),
    updateItemOfUser: jest.fn(),
    archiveItem: jest.fn(),
  };

  const userSvc: Partial<UserService> = {
    currentProfileUser: () => ({ user_id: 'u1' } as any),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClosetComponent, RouterTestingModule],
      providers: [
        { provide: ItemService, useValue: itemSvc },
        { provide: UserService, useValue: userSvc },
        { provide: ChatService, useValue: { unreadMessages: signal(0), countUnreadMessages: jest.fn().mockResolvedValue(0) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClosetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onAddArticle opens dialog and enforces image validation', () => {
    component.onAddArticle();
    expect(component.dialogState()).toBe('open');
    expect(component.addItemForm.controls.images.hasValidator).toBeDefined();
  });

  it('onCancel resets form and state', () => {
    component.addItemForm.patchValue({ name: 'x' });
    component.selectedImageUrls = ['a'];
    component.onCancel();
    expect(component.dialogState()).toBe('closed');
    expect(component.editingItem()).toBeNull();
    expect(component.selectedImageUrls.length).toBe(0);
  });
});
