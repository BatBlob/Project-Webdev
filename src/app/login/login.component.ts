import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  lastattempt;
  @ViewChild('username') username:ElementRef;
  @ViewChild('pass') pass:ElementRef;
  @ViewChild('label') label:ElementRef;

  constructor(private login_service : ChatService, public router: Router) {
    this.login_service.getReply().subscribe((login: string) => {
      console.log(login);
      if (login == "0") {
        this.incorrectinput()
      }
    })
  }
  ngOnInit(): void {
  }

  login() {
    this.lastattempt = 0;
    this.login_service.login(this.username.nativeElement.value, this.pass.nativeElement.value, this.router);
  }
  
  register() {
    this.lastattempt = 1;
    this.login_service.register(this.username.nativeElement.value, this.pass.nativeElement.value, this.router);
  }

  incorrectinput() {
    if (this.lastattempt === 0)
      document.getElementById("label").innerHTML = "Incorrect username/password";
    else
      document.getElementById("label").innerHTML = "Username already in use";
  }

  if_logged_in() {
    if (this.login_service.logged_in == 1)
      return true;
    return false;
  }
}
