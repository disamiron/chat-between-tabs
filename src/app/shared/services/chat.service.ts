import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay, take } from 'rxjs';
import { MessageInterface } from '../interfaces/message.interface';
import { StorageService } from './storage.service';
import { StorageType } from '../types/storage.type';

const broadcastChannelName: string = 'CHAT_BETWEEN_TABS';

enum BroadcastChannelType {
  typing = 'TYPING',
  stopTyping = 'STOP_TYPING',
  message = 'MESSAGE',
  clearHistory = 'CLEAR_HISTORY',
}

@Injectable()
export class ChatService {
  public tabId: string = `Tab-${Math.random()
    .toString(36)
    .substr(2, 5)
    .toLocaleUpperCase()}`;

  private chatHistorySource$: BehaviorSubject<MessageInterface[]> =
    new BehaviorSubject<MessageInterface[]>([]);
  public chatHistory$: Observable<MessageInterface[]> =
    this.chatHistorySource$.pipe(shareReplay(1));

  private typingTabIdsSource$: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  public typingTabIds$: Observable<string[]> = this.typingTabIdsSource$.pipe(
    shareReplay(1)
  );

  private broadcastChannel: BroadcastChannel = new BroadcastChannel(
    broadcastChannelName
  );

  constructor(private storageService: StorageService) {
    this.setupBroadcastChannel();
    this.initChatHistory();
  }

  public startTypingBroadcastEvent(): void {
    this.broadcastChannel.postMessage({
      type: BroadcastChannelType.typing,
      tabId: this.tabId,
    });
  }

  public stopTypingBroadcastEvent(): void {
    this.broadcastChannel.postMessage({
      type: BroadcastChannelType.stopTyping,
      tabId: this.tabId,
    });
  }

  public sendMessageBroadcastEvent(message: string): void {
    const newMessage: MessageInterface = {
      tabId: this.tabId,
      message: message,
      date: new Date(),
    };

    this.broadcastChannel.postMessage({
      type: BroadcastChannelType.message,
      message: newMessage,
    });

    this.addMessage(newMessage);
  }

  public clearHistoryBroadcastEvent(): void {
    this.broadcastChannel.postMessage({
      type: BroadcastChannelType.clearHistory,
    });

    this.clearHistory();
  }

  private clearHistory(): void {
    const clearedHistory: MessageInterface[] = [];

    this.chatHistorySource$.next(clearedHistory);
    this.saveChatHistory(clearedHistory);
  }

  private initChatHistory(): void {
    const chatHistory: MessageInterface[] | null = this.storageService.getItem(
      StorageType.history
    );

    if (chatHistory) {
      this.chatHistorySource$.next(chatHistory);
    }
  }

  private setupBroadcastChannel(): void {
    this.broadcastChannel.onmessage = (event: MessageEvent) => {
      const data = event.data;

      switch (data.type) {
        case BroadcastChannelType.typing: {
          this.addTypingTabId(data.tabId);
          break;
        }

        case BroadcastChannelType.stopTyping: {
          this.removeTabIdById(data.tabId);
          break;
        }

        case BroadcastChannelType.message: {
          this.addMessage(data.message);
          break;
        }

        case BroadcastChannelType.clearHistory: {
          this.clearHistory();
          break;
        }
      }
    };
  }

  private addMessage(message: MessageInterface): void {
    this.chatHistory$
      .pipe(take(1))
      .subscribe((chatHistory: MessageInterface[]) => {
        let updatedChatHistory: MessageInterface[] = [...chatHistory, message];

        if (updatedChatHistory.length > 100) {
          updatedChatHistory.shift();
        }

        this.chatHistorySource$.next([...updatedChatHistory]);

        this.saveChatHistory(updatedChatHistory);

        this.removeTabIdById(message.tabId);
      });
  }

  private addTypingTabId(externalTapId: string): void {
    this.typingTabIds$.pipe(take(1)).subscribe((typingTabIds: string[]) => {
      if (!typingTabIds.includes(externalTapId)) {
        let updatedTabIds: string[] = [...typingTabIds, externalTapId];

        this.typingTabIdsSource$.next(updatedTabIds);
      }
    });
  }

  private removeTabIdById(id: string): void {
    this.typingTabIds$
      .pipe(
        take(1),
        map((typingTabIds: string[]) =>
          typingTabIds.filter((tabId) => tabId !== id)
        )
      )
      .subscribe((updatedTypingTabIds: string[]) =>
        this.typingTabIdsSource$.next(updatedTypingTabIds)
      );
  }

  private saveChatHistory(chatHistory: MessageInterface[]): void {
    this.storageService.setItem(StorageType.history, chatHistory);
  }
}
