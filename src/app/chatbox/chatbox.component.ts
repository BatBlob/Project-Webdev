import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {
  image;
  username;
  @ViewChild('message') message:ElementRef;
  constructor() { }

  ngOnInit(): void {
    document.getElementById("enter").addEventListener("keydown", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("send").click();
      }
    })
  }
  sendMessage() {
    if (this.message.nativeElement.value.replace(/^\s+|\s+$/g, '') != "") {
      const element = document.createElement('li');
      element.innerHTML = "<img src='assets/"+this.image+"' width='50' height='60' style='float: left; margin-right: 10px;'><p style='font-size:Large; font-weight: 500; margin: 0px;';>"+this.username+"</p><p style='margin-bottom: 0px;'>"+this.message.nativeElement.value+"</p>";
      element.style.padding = "15px 30px";
      element.style.margin = "10px";
      element.style.background = "white";
      element.style.wordWrap = "break-word";
      document.getElementById("message-list").appendChild(element);
      document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
    }
    this.message.nativeElement.value = "";
  }
}
