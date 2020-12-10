import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-enter-room',
  templateUrl: './enter-room.component.html',
  styleUrls: ['./enter-room.component.css']
})
export class EnterRoomComponent implements OnInit {

  constructor(private login_service : LoginService, public router: Router) {}
  
  ngOnInit(): void {}

}
