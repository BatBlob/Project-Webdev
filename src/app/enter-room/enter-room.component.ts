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
    console.log(localStorage.getItem("links") !== null);
    if (localStorage.getItem("links") !== null)
    {
      this.links = localStorage.getItem("links").split(",");
      this.chat_service.logged_in = Number(localStorage.getItem("logged_in"));
      this.chat_service.rooms = localStorage.getItem("rooms");
      this.chat_service.username = localStorage.getItem("username");
      localStorage.removeItem("links");
      localStorage.removeItem("logged_in");
      localStorage.removeItem("rooms");
      localStorage.removeItem("username");
    }
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
    localStorage.links = this.links.toString();
    localStorage.logged_in = this.chat_service.logged_in;
    localStorage.rooms = this.chat_service.rooms;
    localStorage.username = this.chat_service.username;
    const formData = new FormData();
    formData.append('file', this.images);
    formData.append('username', this.chat_service.username);
    // formData.append('username', "DIE");
    this.http.post<any>(environment.api_baseroute+"/upload", formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
    // fetch(environment.api_baseroute+"/upload", {
    //   method: 'POST',
    //   body: formData
    // })
    // .then(response => response.json())
    // .then(result => {
    //   console.log('Success:', result);
    // })
  }
}
