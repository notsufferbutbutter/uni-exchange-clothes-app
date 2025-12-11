import { Injectable, signal } from "@angular/core";
import { supabase } from "../supabase/superbase-client";
import { User } from "../pages/interfaces/user.record";


@Injectable({
    providedIn: 'root'
})
export class UserService {
    readonly currentProfileUser = signal<User | null>(null);

    async registerProfileUser(email: string, id: string) {
        const { error } = await supabase
        .from('users')
        .insert({ user_id: id, email: email, username: email, created_at: new Date().toISOString() })

        if(error) console.error('Error registering profile user', error);
    }

    async loadCurrentProfileUser(id: string) {
        const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', id)
        .single();

        if(error) {
            console.error('Error loading current profile user', error)
        };

        this.currentProfileUser.set(data as User);
    }

    async loadUserByUserId(id: string) {
        const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', id)
        .single();

        if(error) {
            console.error('Error loading user by userId', error);
            return null;
        }

        return data;
    }
}