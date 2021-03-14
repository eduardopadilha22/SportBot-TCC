import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  path = 'http://localhost:3333/change-bot'
  messages = [];
  loading = false;
  sessionId = Math.random().toString(36).slice(-5)
  spinnerText = ' . . .'
  avatar: String = null
  title: String

  constructor(private http: HttpClient) {
    this.avatar = '../../../assets//icon-bot.jpeg'
    this.title = 'Converse com o SportBot!'
   }

  ngOnInit() {
    this.addBotMessange(' Olá Eduardo , Vamos começar? ')
  }

  addUserMessange(text){
      this.messages.push({
        text,
        sender:'you',
        reply: true,
        date: new Date()
      })
  }

  addBotMessange(text){
    this.messages.push({
      text,
      sender: 'Bot',
      avatar: this.avatar,
      date: new Date()
    })
  }

  sendMessage($event){
    console.log($event)

    const text = $event.message
    this.addUserMessange(text)

    this.loading = true

    this.http.post<any>(this.path, 
      {
        sessionId: this.sessionId,
        queryInput: {
          text: {
            text,
            languageCode: "pt-BR"
          }
        }
      })
      .subscribe(resp => {
        this.addBotMessange(resp.fulfillmentText);
        this.loading = false
      })
  }

}
