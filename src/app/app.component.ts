import { Component } from '@angular/core';
import { ChatService } from '@shared/services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public tabId: string = this.chatService.tabId;

  constructor(private chatService: ChatService) {}

  public clearHistory(): void {
    this.chatService.clearHistoryBroadcastEvent();
  }
}
