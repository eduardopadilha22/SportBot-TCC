import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NbChatFormComponent, NbInputDirective } from '@nebular/theme';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, AfterViewInit {
  path = 'http://localhost:3333/change-bot'
  messages = [];
  loading = false;
  sessionId = Math.random().toString(36).slice(-5)
  spinnerText = ' . . .'
  avatar: String = null
  title: String
  options: any
  status: String
  @ViewChild('form', { static: false}) formInput :  NbChatFormComponent;

  constructor(private http: HttpClient) {
    this.avatar = '../../../assets//icon-bot.jpeg'
    this.title = 'FALE COM SPORTBOT'
    this.status= 'success'
    this.options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    
   }
  ngAfterViewInit(): void {
     this.formInput.messagePlaceholder = ' Digite uma mensagem.'
  }

  ngOnInit() {
    this.addBotMessange(`Ei! Prazer em conhecê-lo 😊, 
Meu nome é SportBot e ajudo você a melhorar a sua Saúde Física encontrando lugadores onde você poderá praticar o seu Esporte, Atividade Física, Receitas para o Seu dia a dia e muito mais.`);


  console.log(navigator.geolocation.getCurrentPosition(this.success),this.options);
  this.mapsSearch();
  }

   success(pos) {
    var crd = pos.coords;
  
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
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

  mapsSearch() {
    this.http.get('https://www.google.com/maps/search/?api=1&query=campo+sintetico+manaus')
              .subscribe( resp => {
                console.log(resp)
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
        if(resp)
        this.addBotMessange(resp.fulfillmentText);
        this.loading = false
      })
  }

}
