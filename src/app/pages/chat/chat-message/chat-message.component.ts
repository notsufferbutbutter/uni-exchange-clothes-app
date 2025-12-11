import { Component, computed, input } from '@angular/core';
import { ChatMessage } from '../../interfaces/chat-message.record';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-chat-message',
  imports: [NgClass],
  template: `
    <div 
      class="flex w-full mb-2"
      [ngClass]="{
        'justify-end' : currentUserId() === chatMessage().sender_id,
        'justify-start' : currentUserId() !== chatMessage().sender_id
        }"
    >
      <div 
        class="max-w-[50%] px-4 py-2 rounded-2xl text-sm shadow-sm break-words"
        [ngClass]="{
          'bg-[#2c4c3b] text-[#fdfbf7] rounded-br-none': currentUserId() === chatMessage().sender_id,
          'bg-[#e2e8e2] text-[#2c4c3b] rounded-bl-none': currentUserId() !== chatMessage().sender_id
        }"
      >
        @if (parsedMessage().imageUrl) {
          <div class="mb-2">
            <strong>{{ parsedMessage().text }}</strong>
          </div>
          <img 
            [src]="parsedMessage().imageUrl" 
            alt="Trade item"
            class="rounded-lg w-32 h-32 object-cover"
          />
        } @else {
          {{ chatMessage().message }}
        }
      </div>
    </div>
  `,
})
export class ChatMessageComponent {
  readonly currentUserId = input.required<string>();
  readonly chatMessage = input.required<ChatMessage>();

  readonly parsedMessage = computed(() => {
    const message = this.chatMessage().message;
    
    // Check if this is a trade request message with image
    if (message.includes('🔄 Tauschangebot:')) {
      const lines = message.split('\n');
      const text = lines[0]; // "🔄 Tauschangebot: Item Title"
      const imageUrl = lines.slice(1).find(line => 
        line.startsWith('http://') || line.startsWith('https://')
      );
      
      return { text, imageUrl: imageUrl || null };
    }
    
    return { text: message, imageUrl: null };
  });
}
