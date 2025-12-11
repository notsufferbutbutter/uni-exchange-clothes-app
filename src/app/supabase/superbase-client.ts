import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';


// Using Angular environment instead of import.meta.env (Vite style not available)
const supabaseUrl = environment.supabaseUrl;
const supabaseAnonKey = environment.supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
