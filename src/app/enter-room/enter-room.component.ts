import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-enter-room',
  templateUrl: './enter-room.component.html',
  styleUrls: ['./enter-room.component.css']
})
export class EnterRoomComponent implements OnInit {
  links;


  @ViewChild('room') room:ElementRef;

  constructor(private chat_service : ChatService, public router: Router, private http: HttpClient) {
    this.chat_service.getRooms().subscribe((rooms: string) => {
      console.log(rooms);
      if (rooms !== "") {
        this.links = rooms.split(",");
      }
    });
    this.chat_service.ifRoomCreated().subscribe((result: string) => {
      console.log("room created", result);
      if (result === "1") {
        // this.result = 1;
        // this.router.navigate(['chat']);
      }
    });
  }
  
  ngOnInit(): void {
    this.chat_service.askRooms();
  }

  createRoom() {
    this.chat_service.createRoom(this.room.nativeElement.value);
  }

  joinRoom(room) {
    console.log(room);
    this.chat_service.joinRoom(room);
  }

  images;

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
    }
  }

  onSubmit(){
    const formData = new FormData();
    formData.append('file', this.images);
    formData.append('username', this.chat_service.username);
    this.http.post<any>(environment.api_baseroute+"/upload", formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }
}
