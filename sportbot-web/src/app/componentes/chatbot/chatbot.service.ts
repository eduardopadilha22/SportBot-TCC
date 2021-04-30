import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
 // path = 'http://localhost:8080/change-bot'
  path = 'https://sporbotapi.herokuapp.com/change-bot';
  constructor(private http : HttpClient) { }



  sendMessageUsingPost(menssageObj: any) : Observable<any> {
    return this.http.post<any>(this.path,
      {
        sessionId: menssageObj.sessionId,
        queryInput: {
          text: {
            text: menssageObj.queryInput.text.text,
            languageCode: "pt-BR"
          }
        },
        localizacao: menssageObj.location
      });
  }
}
