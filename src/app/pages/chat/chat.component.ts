import { AfterViewInit, Component, computed, effect, ElementRef, inject, signal, ViewChild } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { HlmAvatarImports } from "@spartan-ng/helm/avatar";
import { HlmCardImports } from "@spartan-ng/helm/card";
import { HlmSidebarImports } from "@spartan-ng/helm/sidebar";
import { ChatService } from "../../services/chat.service";
import { ChatMessageComponent } from "./chat-message/chat-message.component";
import { UserService } from "../../services/user.service";
import { User } from "../interfaces/user.record";
import { ChatMessage } from "../interfaces/chat-message.record";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { supabase } from "../../supabase/superbase-client";
import { NavbarComponent } from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-chat',
  imports: [NavbarComponent, HlmCardImports, HlmAvatarImports, HlmSidebarImports, ChatMessageComponent, NgTemplateOutlet, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewInit {
  @ViewChild('msgContainer') readonly msgContainer!: ElementRef<HTMLDivElement>; 
  readonly fb = inject(FormBuilder);
  readonly chatService = inject(ChatService);
  readonly userService = inject(UserService);

  readonly currentUserId = computed(() => this.userService.currentProfileUser()?.user_id);
  readonly partners = signal<User[]>([]);
  readonly selectedPartner = signal<User | null>(null); 

  readonly messages = signal<ChatMessage[]>([]);

  readonly chatForm!: FormGroup;

  ngAfterViewInit() {
    // Scroll when the view is first created
    this.scrollToBottom();
  }


  constructor () {
    effect((onCleanup) => {
      const userId = this.currentUserId();
      if (!userId) return;

      console.log("Initializing Realtime Subscription for User:", userId);
      
      const channel = supabase
        .channel(`public:chats:${userId}`) // Unique channel per user to avoid conflicts
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'chats' },
          (payload) => {
            //update messages
            const newMessage = payload.new as ChatMessage;
    
            const currentPartner = this.selectedPartner();
            const partnerId = currentPartner?.user_id;

            if (!partnerId) return;

            const isRelevant = 
              (newMessage.sender_id === userId && newMessage.receiver_id === partnerId) ||
              (newMessage.sender_id === partnerId && newMessage.receiver_id === userId);

            if (isRelevant) {
              this.messages.update(current => [...current, newMessage]);
            }

            //update count unread messages
            this.chatService.countUnreadMessages(this.currentUserId());
          }
        )
        .subscribe();

      onCleanup(async () => {
        console.log("Cleaning up subscription...");
        await supabase.removeChannel(channel);
      });
    });
    

    effect(async() => {
      const userId = this.currentUserId();
      if (userId) {
        const data = await this.chatService.loadAllPartnersOfCurrentUser(userId);
        this.partners.set(data);
      }
    });

    effect(async() => {
      const userId = this.currentUserId();
      const partner = this.selectedPartner();

      if(!userId || !partner) return;

      const msg = await this.chatService.loadMessageWithCurrentPartner(userId, partner.user_id);
      this.messages.set(msg);
    });

    this.chatForm = this.fb.group({
      chat_message: ['', Validators.required]
    });

    effect(() => {
      const msgs = this.messages();
      if (msgs.length > 0) {
        this.scrollToBottom();
      }
    });
  }

  onSelectPartner(partner: User) {
    this.selectedPartner.set(partner);
    this.chatService.markMessagesAsRead(this.currentUserId(), partner.user_id);
  }

  onSubmitNewMessage() {
    const msg = this.chatForm.value.chat_message;
    const userId = this.currentUserId();
    const partnerId = this.selectedPartner()?.user_id ?? null;

    if(userId && partnerId) {
      this.chatService.addNewMessageWithCurrentPartner(userId, partnerId, msg);
      this.chatForm.reset();
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      const el = this.msgContainer?.nativeElement;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    }, 0);
  }
}