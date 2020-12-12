import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { EnterRoomComponent } from './enter-room/enter-room.component';
import { ChatService } from './chat.service';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'chat', component: EnterRoomComponent, canActivate: [ChatService] },
  { path: 'room', component: ChatboxComponent, canActivate: [ChatService] }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
