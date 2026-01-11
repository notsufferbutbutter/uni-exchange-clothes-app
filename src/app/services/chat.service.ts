import { Injectable, signal, inject } from "@angular/core";
import { ChatMessage } from "../pages/interfaces/chat-message.record";
import { supabase } from "../supabase/superbase-client";
import { User } from "../pages/interfaces/user.record";
import { UserService } from "./user.service";

@Injectable({
    providedIn: 'root',

})
export class ChatService {
    userService = inject(UserService);
    unreadMessages = signal<number>(0);

    async countUnreadMessages(currentUserId: string | undefined) {
      const { count, error } = await supabase
        .from('chats')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .eq('receiver_id', currentUserId);

      if (error) {
        console.error('Failed to count unread messages:', error);
        return 0;
      }

      if (count) {
        this.unreadMessages.set(count);
        
      } else {
        this.unreadMessages.set(0);
      }

      console.log('Unread updated to:', count);

      return;
    }


    async markMessagesAsRead(currentUserId: string | undefined, currentPartnerId: string) {
      const { data, error } = await supabase
        .from('chats')          
        .update({ is_read: true })
        .eq('receiver_id', currentUserId)
        .eq('sender_id', currentPartnerId)
        .eq('is_read', false);

      if (error) {
        console.error('Failed to mark messages as read:', error);
      }

      this.countUnreadMessages(currentUserId);

      return data;
    }


    async loadAllPartnersOfCurrentUser(currentUserId: string): Promise<User[]> {
      const { error, data } = await supabase
        .from('chats')
        .select('receiver_id, sender_id')
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`);

      console.log('Raw chat data:', data);
      if (error || !data) {
        console.error('Failed at loading chat partners', error);
        return [];
      }

      const chatPartnerIds = new Set<string>()

      for (const message of data) {
        // If I am the sender, the partner is the receiver
        if (message.sender_id === currentUserId) {
            chatPartnerIds.add(message.receiver_id);
        } 
        // If I am the receiver, the partner is the sender
        else if (message.receiver_id === currentUserId) {
            chatPartnerIds.add(message.sender_id);
        }
      }

      const chatPartners = Array.from(chatPartnerIds).map( id =>
        this.userService.loadUserByUserId(id)
      );

      const chatPartnersPromise = await Promise.all(chatPartners);

      return chatPartnersPromise.filter(partner => partner !== null) as User[];
    }

    async loadMessageWithCurrentPartner(currentUserId: string, currentPartnerId: string) :Promise<ChatMessage[]> {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${currentPartnerId}),and(sender_id.eq.${currentPartnerId},receiver_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if(error) {
        console.error('Failed at loading message with current partner');
        return [];
      }

      console.log(data);

      const messagesPromise = await Promise.all(data);

      return messagesPromise as ChatMessage[];
    }

    async addNewMessageWithCurrentPartner(sender_id: string, receiver_id:string, msg: string) {
       const { data, error } = await supabase
        .from('chats')
        .insert({
          sender_id,
          receiver_id,
          message: msg
        })
        .select(); 

      if (error) {
        console.error("Failed to send message:", error);
        return null;
      }

      return data[0]; // the inserted message
    }
}