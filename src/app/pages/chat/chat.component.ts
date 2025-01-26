import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BroadcastChannelService } from '@shared/services/broadcast-channel.service';
import { ChatService } from '@shared/services/chat.service';
import { MessageInterface } from '@shared/interfaces/message.interface';
import {
  combineLatest,
  debounceTime,
  delay,
  filter,
  map,
  Observable,
  Subscription,
  tap,
} from 'rxjs';

const CHAT_DELAY_TIME: number = 100;
const CHAT_DEBOUNCE_TIME: number = 5000;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('messagesContainer', { static: false })
  messagesContainer: ElementRef;

  public tabId: string = this.chatService.tabId;

  public chatHistory$: Observable<MessageInterface[]> =
    this.chatService.chatHistory$;

  public filtredTypingTabIds$: Observable<string[]> =
    this.chatService.typingTabIds$.pipe(
      map((typingTabIds: string[]) =>
        typingTabIds.filter((tabId) => tabId !== this.tabId)
      )
    );

  public chatFormGroup: FormGroup = new FormGroup({
    message: new FormControl(null, Validators.required),
  });

  private subscription: Subscription = new Subscription();

  constructor(
    private broadcastChannelService: BroadcastChannelService,
    private chatService: ChatService
  ) {}

  public ngOnInit(): void {
    this.subscription.add(this.onTypingProcessChange());
  }

  public ngAfterViewInit(): void {
    this.subscription.add(this.chatHistoryProcessChange());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public sendMessage(): void {
    if (this.chatFormGroup.invalid) {
      return;
    }

    this.broadcastChannelService.sendMessage(this.chatFormGroup.value.message);
    this.clearMessage();
  }

  private clearMessage(): void {
    this.chatFormGroup.patchValue({ message: null });
  }

  private onTypingProcessChange(): Subscription {
    return this.chatFormGroup.controls.message.valueChanges
      .pipe(
        filter((value: string | null) => !!value),
        tap(() => this.broadcastChannelService.startTyping()),
        debounceTime(CHAT_DEBOUNCE_TIME)
      )
      .subscribe(() => this.broadcastChannelService.stopTyping());
  }

  private chatHistoryProcessChange(): Subscription {
    return combineLatest([this.chatHistory$, this.filtredTypingTabIds$])
      .pipe(delay(CHAT_DELAY_TIME))
      .subscribe(() => this.scrollToBottom());
  }

  private scrollToBottom(): void {
    const container = this.messagesContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }
}
