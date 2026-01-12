import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../app/services/auth.service';
import { UserService } from '../../app/services/user.service';

jest.mock('../supabase/superbase-client', () => {
  return {
    supabase: {
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
        signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }),
        signUp: jest.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }),
        signOut: jest.fn().mockResolvedValue({ error: null }),
      },
    },
  };
});

const supa = require('../supabase/superbase-client').supabase;

describe('AuthService (integration)', () => {
  let service: AuthService;
  const userSvc = {
    loadCurrentProfileUser: jest.fn().mockResolvedValue(void 0),
    registerProfileUser: jest.fn().mockResolvedValue(void 0),
  } as Partial<UserService> as any;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userSvc },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('restoreSession sets isLoggedIn and loads profile when session exists', async () => {
    (supa.auth.getSession as jest.Mock).mockResolvedValueOnce({ data: { session: { user: { id: 'u42' } } } });
    await service.restoreSession();
    expect(userSvc.loadCurrentProfileUser).toHaveBeenCalledWith('u42');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('loginWithEmail sets isLoggedIn and loads profile', async () => {
    const res = await service.loginWithEmail('a@b.com', 'pw');
    expect(userSvc.loadCurrentProfileUser).toHaveBeenCalledWith('u1');
    expect(service.isLoggedIn()).toBe(true);
    expect(res?.data?.user?.id).toBe('u1');
  });

  it('logout clears isLoggedIn', async () => {
    service.isLoggedIn.set(true);
    await service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(supa.auth.signOut).toHaveBeenCalled();
  });
});
