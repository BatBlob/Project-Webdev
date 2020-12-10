import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

  constructor(private login_service : LoginService) { }

  ngOnInit(): void {
  }

  if_logged_in() {
    if (this.login_service.logged_in == 1)
      return true;
    return false;
  }
}
