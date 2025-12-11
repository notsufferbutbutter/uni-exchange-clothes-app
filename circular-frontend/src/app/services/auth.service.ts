import { inject, Injectable, signal } from '@angular/core';
import { supabase } from '../supabase/superbase-client';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly userService = inject(UserService);
  readonly session = signal<any>(null);
  public isLoggedIn = signal<boolean>(false);


  constructor() {
    this.restoreSession();
  }

  async restoreSession() {
    const { data } = await supabase.auth.getSession();
    if ( data?.session ) {
      this.session.set(data.session);
      await this.userService.loadCurrentProfileUser(data.session.user.id);
      this.isLoggedIn.set(true);
    }
  }

  async signupNewUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    })

    if (error) return { error };

    if(data.user) {
      await this.userService.registerProfileUser(email, data.user.id);
    }
    
    return { message: 'Check your email to verify your account' };
  }

  async loginWithEmail(email: string, password: string) { 
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    if (error) return { error };

    if(data.user) {
      await this.userService.loadCurrentProfileUser(data.user.id);
      this.isLoggedIn.set(true);
    }
    
    return { data };
  }

  async logout() { 
    await supabase.auth.signOut();
    this.isLoggedIn.set(false);
  }
}
