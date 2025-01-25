import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {
  public chatFormGroup: FormGroup = new FormGroup({
    message: new FormControl(null, Validators.required),
  });

  public ngOnInit(): void {}

  public sendMessage(): void {
    console.log(this.chatFormGroup.value);
    this.clearMessage();
  }

  public clearMessage(): void {
    this.chatFormGroup.patchValue({ message: null });
  }
}
