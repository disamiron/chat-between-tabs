import { Component } from '@angular/core';
import { BroadcastChannelService } from '@shared/services/broadcast-channel.service';
import { ChatService } from '@shared/services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public tabId: string = this.chatService.tabId;

  constructor(
    private broadcastChannelService: BroadcastChannelService,
    private chatService: ChatService
  ) {}

  public clearHistory(): void {
    this.broadcastChannelService.clearHistory();
  }
}
