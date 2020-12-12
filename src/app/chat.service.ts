import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
// import {io} from 'socket.io-client';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  logged_in = 0;
  rooms;
  username;
  // socket;
  constructor(private socket: Socket, private router: Router) {
    this.getReply().subscribe((login: string) => {
      console.log(login);
      if (login === "1") {
        this.logged_in = 1;
        this.router.navigate(['chat']);
      }
    });
    

    
   }
  login(username_: string, pass_: string, router: Router)
  {
    this.username = username_;
    this.socket.emit("login", JSON.stringify({username: username_, pass: pass_}));
  }
  register(username_: string, pass_: string, router: Router)
  {
    this.username = username_;
    this.socket.emit("register", JSON.stringify({username: username_, pass: pass_}));
  }
  getReply() {
    return Observable.create((observer) => {
      this.socket.on("login", (message) => {
        observer.next(message);
      });
    });
  }

  ifRoomCreated() {
    return Observable.create((observer) => {
      this.socket.on("create", (message) => {
        observer.next(message);
      });
    });
  }

  getRooms() {
    return Observable.create((observer) => {
      this.socket.on("rooms list", (message) => {
        observer.next(message);
      });
    });
  }

  askRooms() {
    this.socket.emit("rooms list");
  }

  joinRoom(room: string) {
    this.socket.emit("join", JSON.stringify({username: this.username, roomname: room}));
    this.router.navigate(['/room']);
  }

  createRoom(room: string) {
    this.socket.emit("create", JSON.stringify({roomname: room}));
  }

  getMessagesList() {
    return Observable.create((observer) => {
      this.socket.on("join", (message) => {
        observer.next(message);
      });
    });
  }

  sendMessage(message_: string) {
    this.socket.emit("message", JSON.stringify({username: this.username, message: message_}));
  }
  
  canActivate() {
    if (this.logged_in == 1)
      return true;
    this.router.navigate(['']);
    return false;
  }
}
