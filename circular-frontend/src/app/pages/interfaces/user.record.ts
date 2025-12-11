export interface User {
  readonly user_id: string;          // UUID (primary key from Supabase auth)
  readonly username?: string;
  readonly created_at: string;        // ISO timestamp
  readonly email: string;

  readonly avatar_url?: string | null;
  readonly bio?: string | null;
  readonly location_city?: string | null;
  readonly location_country?: string | null;
}
