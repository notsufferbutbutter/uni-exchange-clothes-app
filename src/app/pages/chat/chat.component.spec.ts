import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { signal } from '@angular/core';
import { ChatComponent } from './chat.component';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { createMockUser } from '../../../test/factories/user.factory';
import { AuthService } from '../../services/auth.service';

jest.mock('../../supabase/superbase-client', () => ({
    supabase: {
        channel: () => ({ on: () => ({ subscribe: () => ({}) }) }),
        removeChannel: async () => {},
    },
}));

describe('ChatComponent', () => {
    let component: ChatComponent;
    let fixture: ComponentFixture<ChatComponent>;
    const currentUserSignal = signal<any>(null);

    const chatSvc: Partial<ChatService> = {
        addNewMessageWithCurrentPartner: jest.fn(),
        loadAllPartnersOfCurrentUser: jest.fn().mockResolvedValue([]),
        loadMessageWithCurrentPartner: jest.fn().mockResolvedValue([]),
        markMessagesAsRead: jest.fn().mockResolvedValue([] as any),
        countUnreadMessages: jest.fn().mockResolvedValue(0),
        unreadMessages: signal(0) as any,
    };

    const userSvc: Partial<UserService> = {
        currentProfileUser: () => currentUserSignal(),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChatComponent, RouterTestingModule],
            providers: [
                { provide: ChatService, useValue: chatSvc },
                { provide: UserService, useValue: userSvc },
                { provide: AuthService, useValue: { isLoggedIn: signal(false) } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ChatComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('sends message and resets form on submit', () => {
        const user = createMockUser({ user_id: '1' });
        const partner = createMockUser({ user_id: '2' });
        currentUserSignal.set(user);
        component.onSelectPartner(partner);

        component.chatForm.setValue({ chat_message: 'test message' });
        component.onSubmitNewMessage();

        expect(chatSvc.addNewMessageWithCurrentPartner).toHaveBeenCalledWith('1', '2', 'test message');
        expect(component.chatForm.value.chat_message).toBeNull();
    });

    it('loads partners when user logs in', async () => {
        const user = createMockUser({ user_id: '1' });
        currentUserSignal.set(user);
        // allow effects to run
        await Promise.resolve();
        await Promise.resolve();
        expect(chatSvc.loadAllPartnersOfCurrentUser).toHaveBeenCalledWith('1');
        expect(component.partners()).toEqual([]);
    });
});