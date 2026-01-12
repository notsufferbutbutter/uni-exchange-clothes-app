import { User } from "../../app/pages/interfaces/user.record";

export function createMockUser(overrides: Partial<User> = {}) : User {
    return {
        user_id: '1',
        username: 'testUser',
        created_at: new Date().toISOString(),
        email: 'testUser@gmail.com',
        ...overrides
    }
}