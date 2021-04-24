import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Platform } from '@angular/cdk/platform';

//nebular



//chatboot 
import { ChatbotComponent } from './componentes/chatbot/chatbot.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbChatModule, NbIconLibraries, NbSpinnerModule , NbChatOptions , NbIconModule   } from '@nebular/theme';
import { HttpClientModule } from '@angular/common/http';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@NgModule({
  declarations: [
    AppComponent,
    ChatbotComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbSpinnerModule,
    HttpClientModule,
    NbChatModule,
    NbEvaIconsModule,
    NbIconModule
  ],
  providers: [
    Platform,
    NbIconLibraries,
    NbChatOptions,
    NbIconModule
    ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
