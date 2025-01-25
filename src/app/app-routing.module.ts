import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './pages/chat/chat.component';
import { urlValues } from './shared/constants/url-values.const';

const routes: Routes = [
  {
    path: urlValues.chat,
    component: ChatComponent,
  },
  { path: '**', redirectTo: urlValues.chat, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
