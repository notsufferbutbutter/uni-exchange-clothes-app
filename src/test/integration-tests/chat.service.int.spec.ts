import { TestBed } from '@angular/core/testing';
import { ChatService } from '../../app/services/chat.service';
import { UserService } from '../../app/services/user.service';

jest.mock('../supabase/superbase-client', () => {
  const chain = (rows: any[]) => ({
    select: () => ({
      or: () => ({ data: rows, error: null }),
    }),
  });
  return {
    supabase: {
      from: jest.fn().mockImplementation((table: string) => {
        if (table === 'chats') {
          const rows = [
            { sender_id: 'u1', receiver_id: 'u2' },
            { sender_id: 'u3', receiver_id: 'u1' },
          ];
          return chain(rows);
        }
        return chain([]);
      }),
    },
  };
});


describe('ChatService (integration)', () => {
  let service: ChatService;
  const userSvc = {
    loadUserByUserId: jest.fn().mockImplementation(async (id: string) => ({ user_id: id, username: id.toUpperCase() })),
  } as Partial<UserService> as any;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        ChatService,
        { provide: UserService, useValue: userSvc },
      ],
    });
    service = TestBed.inject(ChatService);
  });

  it('loadAllPartnersOfCurrentUser returns unique resolved users', async () => {
    const result = await service.loadAllPartnersOfCurrentUser('u1');
    const ids = result.map(u => u.user_id).sort();
    expect(ids).toEqual(['u2', 'u3']);
    expect(userSvc.loadUserByUserId).toHaveBeenCalledTimes(2);
  });
});
