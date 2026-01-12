export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null } }),
    signInWithPassword: async () => ({ data: { user: { id: 'u1' } }, error: null }),
    signUp: async () => ({ data: { user: { id: 'u1' } }, error: null }),
    signOut: async () => ({ error: null }),
  },
  channel: () => ({ on: () => ({ subscribe: () => ({}) }) }),
  removeChannel: async () => {},
};
