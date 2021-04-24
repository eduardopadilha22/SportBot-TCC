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
  lugares = []
  fileLugares = [];
  ultimoTexto: String;
  buscaLocalizacao: Boolean = false;
  @ViewChild('form', { static: false }) formInput: NbChatFormComponent;

  constructor(private http: HttpClient) {
    this.avatar = '../../../assets//icon-bot.jpeg'
    this.title = 'FALE COM SPORTBOT'
    this.status = 'success'
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

Meu nome é SportBot e ajudo você a melhorar a sua Saúde Física encontrando lugares onde você poderá praticar o seu Esporte, Atividade Física, Receitas para o Seu dia a dia e muito mais.

vamos começar realizando seu cadastro ? digite "quero cadastrar",  se você já tem cadastro apenas digite seu e-email. 😆`);

    console.log(navigator.geolocation.getCurrentPosition(this.success), this.options);

  }

  success(pos) {
    var crd = pos.coords;

    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
  }

  addUserMessange(text) {
    this.messages.push({
      text,
      sender: 'you',
      reply: true,
      date: new Date()
    })
  }

  addBotMessange(text, latitude?, longitude?) {
    this.messages.push({
      text,
      sender: 'Bot',
      avatar: this.avatar,
      date: new Date()
    })
  }



  sendMessage($event) {

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
        if (resp) {
          if (resp.webhookPayload !== null) {

            this.lugares = JSON.parse(resp.webhookPayload.fields.lugares.stringValue);
            this.fileLugares = this.lugares.map(lugar => {
              return {
                url: `https://www.google.com/maps/search/?api=1&query=${lugar.name}&query_place_id=${lugar.place_id}`,
                icon: 'pin-outline'
              }
            })
            this.buscaLocalizacao = true;
            this.ultimoTexto = `Top !! aqui estão os lugares perto da sua localização, reserve um tempo e realize a sua atividade!
                                clique no ícone e descubra. ⚽⚽ 🏀 🏈 ⚾ 🥎 🎾 🏐 🏉 🎱 🥏 🏓 🏸 🥅`
          }
          this.addBotMessange(resp.fulfillmentText);
          this.loading = false
        }

      })
  }

}
