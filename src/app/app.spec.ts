import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders the landing with nationwide coverage', async () => {
    const harness = await RouterTestingHarness.create('/');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(
      'Cumplimiento real y adaptado de protección de datos',
    );
    expect(harness.routeNativeElement?.textContent).toContain('Salamanca y toda España');
  });

  it('rejects an empty request without creating an email draft', async () => {
    const harness = await RouterTestingHarness.create('/');
    harness.routeNativeElement
      ?.querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelector('.form-feedback')?.textContent).toContain(
      'Revisa los campos',
    );
    expect(harness.routeNativeElement?.querySelector('.draft-result')).toBeNull();
  });

  it('requires accepting the privacy policy before preparing an email draft', async () => {
    const harness = await RouterTestingHarness.create('/');
    const root = harness.routeNativeElement!;
    const fill = (selector: string, value: string) => {
      const input = root.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector)!;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const privacy = root.querySelector<HTMLInputElement>('#privacyAccepted')!;
    expect(privacy.checked).toBe(false);

    fill('#name', 'Ana García');
    fill('#company', 'Clínica & Salud');
    fill('#email', 'ana@example.com');
    fill('#sector', 'Sanidad y clínicas');
    fill('#message', 'Necesito asesoramiento para una clínica en Madrid.');

    root
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    harness.detectChanges();
    expect(root.querySelector('#privacy-error')?.textContent).toContain('Política de Privacidad');
    expect(root.querySelector('.draft-result')).toBeNull();

    privacy.click();
    harness.detectChanges();
    root
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    harness.detectChanges();

    const link = root.querySelector<HTMLAnchorElement>('.draft-result a')!;
    expect(link.getAttribute('href')).toMatch(/^mailto:albertodatos@mazadpd\.com\?subject=/);
    const url = new URL(link.href);
    expect(url.searchParams.get('body')).toContain('Empresa / Organización: Clínica & Salud');
    expect(url.searchParams.get('body')).toContain(
      'Sector o tipo de actividad: Sanidad y clínicas',
    );
    expect(url.searchParams.get('body')).toContain(
      'Necesito asesoramiento para una clínica en Madrid.',
    );
    expect(root.querySelector('.draft-result')?.textContent).toContain('todavía no enviada');

    fill('#email', 'otro@example.com');
    harness.detectChanges();
    expect(root.querySelector('.draft-result')).toBeNull();
  });

  it('updates the legal document and robots metadata on route changes', async () => {
    const harness = await RouterTestingHarness.create('/aviso-legal');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Aviso legal');
    await harness.navigateByUrl('/privacidad');
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Privacidad');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'noindex, follow',
    );
    await harness.navigateByUrl('/');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'index, follow',
    );
  });
});
