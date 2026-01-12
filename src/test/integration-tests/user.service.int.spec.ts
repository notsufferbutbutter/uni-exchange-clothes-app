import { UserService } from '../../app/services/user.service';

jest.mock('../supabase/superbase-client', () => {
  return {
    supabase: {
      from: jest.fn().mockReturnValue({
        update: () => ({
          eq: () => ({ select: () => ({ single: () => ({ data: { user_id: 'u1', username: 'new' }, error: null }) }) }),
        }),
      }),
    },
  };
});


describe('UserService (integration)', () => {
  let service: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UserService();
    // seed current user
    (service as any).currentProfileUser.set({ user_id: 'u1', username: 'old' } as any);
  });

  it('updateCurrentProfileUser updates the signal with returned data', async () => {
    const res = await service.updateCurrentProfileUser({ username: 'new' });
    expect(res?.username).toBe('new');
    expect(service.currentProfileUser()?.username).toBe('new');
  });
});
