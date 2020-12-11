import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-enter-room',
  templateUrl: './enter-room.component.html',
  styleUrls: ['./enter-room.component.css']
})
export class EnterRoomComponent implements OnInit {
  links;
  constructor(private chat_service : ChatService, public router: Router) {
    this.chat_service.getRooms().subscribe((rooms: string) => {
      console.log(rooms);
      if (rooms !== "") {
        this.links = rooms.split(",");
      }
    });
  }
  
  ngOnInit(): void {
    this.chat_service.askRooms();
  }

  createRoom() {
    
  }

}
