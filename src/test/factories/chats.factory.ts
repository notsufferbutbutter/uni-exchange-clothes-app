import { ChatMessage } from "../../app/pages/interfaces/chat-message.record";
import { createMockUser } from "./user.factory";

export function createMockMessage (overrides: Partial<ChatMessage> = {}) {
    const user1 = createMockUser({user_id: '1', email: 'testUser1@gmail.com', username: 'testUser1'});
    const user2 = createMockUser({user_id: '2', email: 'testUser2@gmail.com', username: 'testUser2'});
    return {
        id: '1',
        sender_id: user1.user_id,
        receiver_id: user2.user_id,
        message: 'Test Message',
        created_at: new Date().toISOString
    }
}