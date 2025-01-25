import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MessageInterface } from '../../interfaces/message.interface';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
  @Input({ required: true }) public message: MessageInterface;
  @Input() isOwner: boolean = false;
}
