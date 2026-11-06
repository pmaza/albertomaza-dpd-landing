import { Component, signal, viewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CookieConsentPanel } from './cookie-consent';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, CookieConsentPanel],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly menuOpen = signal(false);
  protected readonly cookies = viewChild.required(CookieConsentPanel);

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
