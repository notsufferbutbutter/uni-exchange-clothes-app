import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { signal } from '@angular/core';
import { FavoritesComponent } from './favorites.component';
import { FavoritesService } from '../../services/favorites.service';
import { UserService } from '../../services/user.service';
import { ChatService } from '../../services/chat.service';


describe('FavoritesComponent', () => {
  let fixture: ComponentFixture<FavoritesComponent>;
  let component: FavoritesComponent;

  const favSvc: Partial<FavoritesService> = {
    favourites: signal<any[]>([]),
    loadFavorites: jest.fn().mockResolvedValue([]),
  } as any;

  const userSvc: Partial<UserService> = {
    currentProfileUser: () => ({ user_id: 'u42' } as any),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesComponent, RouterTestingModule],
      providers: [
        { provide: FavoritesService, useValue: favSvc },
        { provide: UserService, useValue: userSvc },
        { provide: ChatService, useValue: { unreadMessages: signal(0), countUnreadMessages: jest.fn().mockResolvedValue(0) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads favorites for current user', async () => {
    await Promise.resolve();
    await Promise.resolve();
    expect(favSvc.loadFavorites).toHaveBeenCalledWith('u42');
  });
});
