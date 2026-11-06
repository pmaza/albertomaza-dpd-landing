import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CookieConsent } from './cookie-consent.service';

@Component({
  selector: 'app-cookie-consent',
  imports: [RouterLink],
  templateUrl: './cookie-consent.html',
  styleUrl: './cookie-consent.css',
})
export class CookieConsentPanel {
  protected readonly consent = inject(CookieConsent);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('settings');
  private readonly analytics = viewChild.required<ElementRef<HTMLInputElement>>('analytics');

  openSettings(): void {
    this.consent.refresh();
    this.analytics().nativeElement.checked = this.consent.analyticsSelected();
    this.dialog().nativeElement.showModal();
  }

  protected choose(analytics: boolean): void {
    this.consent.choose(analytics);
    if (!this.consent.error()) this.dialog().nativeElement.close();
  }

  protected saveSettings(): void {
    this.choose(this.analytics().nativeElement.checked);
  }

  protected closeSettings(): void {
    this.dialog().nativeElement.close();
  }

  protected keepFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const dialog = this.dialog().nativeElement;
    const controls = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled])',
      ),
    );
    const first = controls[0];
    const last = controls.at(-1);
    const active = dialog.ownerDocument.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first?.focus();
    }
  }
}
