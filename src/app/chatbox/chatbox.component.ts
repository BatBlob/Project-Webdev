import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {
  messages;
  image;
  username;
  @ViewChild('message') message:ElementRef;
  constructor(private chat_service: ChatService) { }

  ngOnInit(): void {
    document.getElementById("enter").addEventListener("keydown", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("send").click();
      }
    })

    this.chat_service.getMessagesList().subscribe((messages: string) => {
      console.log(messages);
      this.messages = this.parseMessagesList(messages);
    });
  }
  sendMessage() {
    if (this.message.nativeElement.value.replace(/^\s+|\s+$/g, '') != "") {
      const element = document.createElement('li');
      element.innerHTML = "<img src='assets/"+this.image+"' width='50' height='60' style='float: left; margin-right: 10px;'><p style='font-size:Large; font-weight: 500; margin: 0px;';>"+this.chat_service.username+"</p><p style='margin-bottom: 0px;'>"+this.message.nativeElement.value+"</p>";
      element.style.padding = "15px 30px";
      element.style.margin = "10px";
      element.style.background = "white";
      element.style.wordWrap = "break-word";
      document.getElementById("message-list").appendChild(element);
      document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
      this.chat_service.sendMessage(this.message.nativeElement.value);
    }
    this.message.nativeElement.value = "";
  }

  parseMessagesList(messages) {
    if (messages === "")
      return [];
    messages = messages.replace(/},{/g, "},,{");
    messages = messages.split(",,");
    console.log(messages);
    for (const x in messages) {
      messages[x] = JSON.parse(messages[x]);
    }
    return messages;    
  }
}
