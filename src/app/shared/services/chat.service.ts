import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  Observable,
  shareReplay,
  take,
} from 'rxjs';
import { MessageInterface } from '../interfaces/message.interface';
import { StorageService } from './storage.service';
import { StorageType } from '../types/storage.type';

@Injectable()
export class ChatService {
  public tabId: string = `Tab-${Math.random()
    .toString(36)
    .substr(2, 5)
    .toLocaleUpperCase()}`;

  private chatHistorySource$: BehaviorSubject<MessageInterface[]> =
    new BehaviorSubject<MessageInterface[]>([]);
  public chatHistory$: Observable<MessageInterface[]> =
    this.chatHistorySource$.pipe(shareReplay(1), distinctUntilChanged());

  private typingTabIdsSource$: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  public typingTabIds$: Observable<string[]> = this.typingTabIdsSource$.pipe(
    shareReplay(1),
    distinctUntilChanged()
  );

  constructor(private storageService: StorageService) {
    this.initChatHistory();
  }

  public addMessage(message: MessageInterface): void {
    this.chatHistory$
      .pipe(take(1))
      .subscribe((chatHistory: MessageInterface[]) => {
        const updatedChatHistory: MessageInterface[] = [
          ...chatHistory,
          message,
        ];

        this.chatHistorySource$.next([...updatedChatHistory]);
        this.removeTabIdById(message.tabId);

        this.saveChatHistory(updatedChatHistory);
      });
  }

  public clearHistory(): void {
    this.chatHistorySource$.next([]);
    this.saveChatHistory([]);
  }

  public addTypingTabId(externalTapId: string): void {
    this.typingTabIds$.pipe(take(1)).subscribe((typingTabIds: string[]) => {
      if (!typingTabIds.includes(externalTapId)) {
        let updatedTabIds: string[] = [...typingTabIds, externalTapId];

        this.typingTabIdsSource$.next(updatedTabIds);
      }
    });
  }

  public removeTabIdById(id: string): void {
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

  private initChatHistory(): void {
    const chatHistory: MessageInterface[] | null = this.storageService.getItem<
      MessageInterface[] | null
    >(StorageType.history);

    if (chatHistory) {
      this.chatHistorySource$.next(chatHistory);
    }
  }

  private saveChatHistory(chatHistory: MessageInterface[]): void {
    this.storageService.setItem(StorageType.history, chatHistory);
  }
}
