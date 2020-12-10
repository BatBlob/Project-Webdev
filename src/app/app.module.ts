import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { EnterRoomComponent } from './enter-room/enter-room.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { LoginService } from './login.service';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './login/login.component';

const config: SocketIoConfig = { url: environment.api_baseroute, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    ChatroomComponent,
    EnterRoomComponent,
    ChatboxComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
