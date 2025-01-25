import { Injectable } from '@angular/core';
import { MessageInterface } from '../interfaces/message.interface';
import { ChatService } from './chat.service';

const broadcastChannelName: string = 'CHAT_BETWEEN_TABS';

enum BroadcastChannelType {
  typing = 'TYPING',
  stopTyping = 'STOP_TYPING',
  message = 'MESSAGE',
  clearHistory = 'CLEAR_HISTORY',
}

@Injectable()
export class BroadcastChannelService {
  private broadcastChannel: BroadcastChannel = new BroadcastChannel(
    broadcastChannelName
  );

  constructor(private chatService: ChatService) {
    this.setupBroadcastChannel();
  }

  public startTyping(): void {
    this.broadcastChannel.postMessage({
      type: BroadcastChannelType.typing,
      tabId: this.chatService.tabId,
    });
  }

  public stopTyping(): void {
    this.broadcastChannel.postMessage({
      type: BroadcastChannelType.stopTyping,
      tabId: this.chatService.tabId,
    });
  }

  public sendMessage(message: string): void {
    const newMessage: MessageInterface = {
      tabId: this.chatService.tabId,
      message: message,
      date: new Date(),
    };

    this.broadcastChannel.postMessage({
      type: BroadcastChannelType.message,
      message: newMessage,
    });

    this.chatService.addMessage(newMessage);
  }

  public clearHistory(): void {
    this.broadcastChannel.postMessage({
      type: BroadcastChannelType.clearHistory,
    });

    this.chatService.clearHistory();
  }

  private setupBroadcastChannel(): void {
    this.broadcastChannel.onmessage = (event: MessageEvent) => {
      const data = event.data;

      switch (data.type) {
        case BroadcastChannelType.typing: {
          this.chatService.addTypingTabId(data.tabId);
          break;
        }

        case BroadcastChannelType.stopTyping: {
          this.chatService.removeTabIdById(data.tabId);
          break;
        }

        case BroadcastChannelType.message: {
          this.chatService.addMessage(data.message);
          break;
        }

        case BroadcastChannelType.clearHistory: {
          this.chatService.clearHistory();
          break;
        }
      }
    };
  }
}
