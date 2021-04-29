import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NbChatFormComponent, NbInputDirective } from '@nebular/theme';
import { ChatbotService } from './chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styles: [`
  ::ng-deep nb-layout-column {
    justify-content: center;
    display: flex;
  }
  nb-chat {
    width: 500px;
    margin: 0.5rem 0 2rem 2rem;
  }`],
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
  localizacao
  @ViewChild('form', { static: false }) formInput: NbChatFormComponent;

  constructor(private chatbotService: ChatbotService) {
    this.avatar = '../../../assets//icon-bot.jpeg'
    this.title = 'FALE COM SPORTBOT'
    this.status = 'success'
    this.options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    this.localizacao = {
      longitude: 0,
      latitude: 0
    }
  }
  ngAfterViewInit(): void {
    this.formInput.messagePlaceholder = ' Digite uma mensagem.'
    this.buscarLocalizacao();
  }

  ngOnInit() {
    this.addBotMessange(`Ei! Prazer em conhecê-lo 😊,

Meu nome é SportBot e ajudo você a melhorar a sua Saúde Física encontrando lugares onde você poderá praticar o seu Esporte, Atividade Física, Receitas para o Seu dia a dia e muito mais.

vamos começar realizando seu cadastro ? digite "quero cadastrar",  se você já tem cadastro apenas digite seu e-email. 😆`, 'text', null);


  }

  buscarLocalizacao() {
    navigator.geolocation.getCurrentPosition(e => {
      console.log(e.coords)
      this.localizacao.longitude = e.coords.longitude;
      this.localizacao.latitude = e.coords.latitude;
    })
  }


  addUserMessange(text, type?, files?) {
    this.messages.push({
      text,
      sender: 'you',
      reply: true,
      type: type,
      date: new Date(),
      files: files ? files : null
    })
    window.scroll(0,document.body.scrollHeight)
  }

  addBotMessange(text, type, files) {
    this.messages.push({
      text,
      type: type,
      sender: 'Bot',
      avatar: this.avatar,
      files: files,
      date: new Date()
    })
    window.scroll(0,document.body.scrollHeight)
  }



  sendMessage($event) {

    const text = $event.message
    this.addUserMessange(text, 'text')

    this.loading = true

    this.chatbotService.sendMessageUsingPost({
      sessionId: this.sessionId,
      queryInput: {
        text: {
          text: text,
          languageCode: "pt-BR"
        }
      },
      location: this.localizacao
    }).subscribe(resp => {
      if (resp) {
        if (resp.webhookPayload !== null) {

          this.lugares = JSON.parse(resp.webhookPayload.fields.lugares.stringValue);
          this.fileLugares = this.lugares.map(lugar => {
            return {
              url: `https://www.google.com/maps/search/?api=1&query=${lugar.name}&query_place_id=${lugar.place_id}`,
              icon: 'pin-outline'
            }
          })
          //  this.buscaLocalizacao = true;
          this.ultimoTexto = `Top !! aqui estão os lugares perto da sua localização, reserve um tempo e realize a sua atividade! clique no ícone e descubra. ⚽⚽ 🏀 🏈 ⚾ 🥎 🎾 🏐 🏉 🎱 🥏 🏓 🏸 🥅`;

          this.addBotMessange(this.ultimoTexto, 'file', this.fileLugares);
          this.chatbotService.sendMessageUsingPost({
            sessionId: this.sessionId,
            queryInput: {
              text: {
                text: 'sim',
                languageCode: "pt-BR"
              }
            },
            location: this.localizacao
          }).subscribe(resp => {
            this.addBotMessange(resp.fulfillmentText, 'text', null);
          })
        } else {
          this.addBotMessange(resp.fulfillmentText, 'text', null);

        }
        this.loading = false
      }

    })
  }

}
