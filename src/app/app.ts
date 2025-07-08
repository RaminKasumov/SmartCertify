import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './pages/header/header';
import { Footer } from './pages/footer/footer';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, NgxSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'smartcertify';
  isIframe = false;

  constructor() {
    // Check if running in iframe (for MSAL)
    this.isIframe = window !== window.parent && !window.opener;
  }
}
