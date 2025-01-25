import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MessageComponent } from './components/message/message.component';
import { MatCardModule } from '@angular/material/card';
import { TypingTabIdsPipe } from './pipes/typing-tab-ids.pipe';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [MessageComponent, TypingTabIdsPipe],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    CommonModule,
  ],
  exports: [
    MessageComponent,
    TypingTabIdsPipe,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
  ],
})
export class SharedModule {}
