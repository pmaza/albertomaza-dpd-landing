import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { CookieConsentPanel } from './cookie-consent';
import {
  COOKIE_MAX_AGE,
  COOKIE_NAME,
  COOKIE_POLICY,
  CookieConsent,
  CookiePolicy,
} from './cookie-consent.service';

describe('Cookie consent', () => {
  let policy: CookiePolicy;

  beforeEach(() => {
    document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0`;
    policy = { version: 'test-policy.1', analyticsAvailable: false };
    TestBed.configureTestingModule({
      imports: [CookieConsentPanel],
      providers: [provideRouter([]), { provide: COOKIE_POLICY, useValue: policy }],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0`;
  });

  const savedRecord = () => {
    const value = document.cookie.split('; ').find((entry) => entry.startsWith(`${COOKIE_NAME}=`))!;
    return JSON.parse(decodeURIComponent(value.slice(COOKIE_NAME.length + 1)));
  };

  async function panel() {
    const fixture = TestBed.createComponent(CookieConsentPanel);
    fixture.detectChanges();
    await fixture.whenStable();
    TestBed.inject(CookieConsent).refresh();
    fixture.detectChanges();
    return fixture;
  }

  it('starts without cookies or analytics and shows an informative banner', async () => {
    const fixture = await panel();
    expect(document.cookie).not.toContain(COOKIE_NAME);
    expect(fixture.nativeElement.querySelector('.cookie-banner').textContent).toContain(
      'Actualmente no utilizamos analítica',
    );
    expect(TestBed.inject(CookieConsent).canUseAnalytics()).toBe(false);
    expect(document.querySelector('script[src*="google"]')).toBeNull();
  });

  it('disables unavailable analytics and never records advance consent', async () => {
    const fixture = await panel();
    expect(fixture.nativeElement.querySelector('#cookie-analytics').disabled).toBe(true);
    TestBed.inject(CookieConsent).choose(true);
    expect(savedRecord()).toMatchObject({
      necessary: true,
      analytics: false,
      version: policy.version,
    });
    expect(TestBed.inject(CookieConsent).canUseAnalytics()).toBe(false);
  });

  it('stores only the preference and its validity for 180 days when requested', () => {
    const consent = TestBed.inject(CookieConsent);
    consent.choose(false);
    const record = savedRecord();
    expect(Object.keys(record).sort()).toEqual([
      'analytics',
      'expiresAt',
      'necessary',
      'updatedAt',
      'version',
    ]);
    expect(record.expiresAt - record.updatedAt).toBe(COOKIE_MAX_AGE * 1000);
    expect(record.analytics).toBe(false);
    expect(consent.bannerVisible()).toBe(false);
  });

  it('retains rejection across reloads without reopening the banner', () => {
    TestBed.inject(CookieConsent).choose(false);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [{ provide: COOKIE_POLICY, useValue: policy }] });
    const consent = TestBed.inject(CookieConsent);
    consent.refresh();
    expect(consent.bannerVisible()).toBe(false);
    expect(consent.canUseAnalytics()).toBe(false);
  });

  it('blocks analytics when a previously accepted preference reaches expiration', () => {
    policy.analyticsAvailable = true;
    const consent = TestBed.inject(CookieConsent);
    consent.choose(true);
    const expiresAt = savedRecord().expiresAt;
    const clock = vi.spyOn(Date, 'now');
    clock.mockReturnValue(expiresAt - 1);
    expect(consent.canUseAnalytics()).toBe(true);
    clock.mockReturnValue(expiresAt);
    expect(consent.canUseAnalytics()).toBe(false);
    consent.refresh();
    expect(consent.bannerVisible()).toBe(true);
  });

  it('requires a new choice when the policy or provider changes', () => {
    const consent = TestBed.inject(CookieConsent);
    consent.choose(false);
    policy.version = 'new-provider-policy.2';
    policy.analyticsAvailable = true;
    consent.refresh();
    expect(consent.bannerVisible()).toBe(true);
    expect(consent.canUseAnalytics()).toBe(false);
  });

  it('permits configured analytics only after explicit consent and revokes immediately', () => {
    policy.analyticsAvailable = true;
    const consent = TestBed.inject(CookieConsent);
    expect(consent.canUseAnalytics()).toBe(false);
    consent.choose(true);
    expect(consent.canUseAnalytics()).toBe(true);
    consent.choose(false);
    expect(consent.canUseAnalytics()).toBe(false);
    expect(savedRecord().analytics).toBe(false);
  });

  it('honors Global Privacy Control even after a prior acceptance', () => {
    policy.analyticsAvailable = true;
    const consent = TestBed.inject(CookieConsent);
    consent.choose(true);
    Object.defineProperty(navigator, 'globalPrivacyControl', { configurable: true, value: true });
    try {
      expect(consent.canUseAnalytics()).toBe(false);
      consent.choose(true);
      expect(savedRecord().analytics).toBe(false);
    } finally {
      Reflect.deleteProperty(navigator, 'globalPrivacyControl');
    }
  });

  it.each(['%not-encoded', encodeURIComponent('{broken'), encodeURIComponent('null')])(
    'blocks optional cookies for malformed preference %s',
    (value) => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      document.cookie = `${COOKIE_NAME}=${value}; Path=/`;
      policy.analyticsAvailable = true;
      const consent = TestBed.inject(CookieConsent);
      consent.refresh();
      expect(consent.bannerVisible()).toBe(true);
      expect(consent.canUseAnalytics()).toBe(false);
    },
  );

  it.each(['future', 'too-long', 'missing-choice', 'wrong-version', 'wrong-type', 'not-necessary'])(
    'rejects invalid preference partition: %s',
    (partition) => {
      const now = Date.now();
      const record: Record<string, unknown> = {
        version: policy.version,
        necessary: true,
        analytics: true,
        updatedAt: now,
        expiresAt: now + COOKIE_MAX_AGE * 1000,
      };
      if (partition === 'future') record['updatedAt'] = now + 10000;
      if (partition === 'too-long') record['expiresAt'] = now + (COOKIE_MAX_AGE + 1) * 1000;
      if (partition === 'missing-choice') delete record['analytics'];
      if (partition === 'wrong-version') record['version'] = 'old';
      if (partition === 'wrong-type') record['expiresAt'] = 'tomorrow';
      if (partition === 'not-necessary') record['necessary'] = false;
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(record))}; Path=/`;
      policy.analyticsAvailable = true;
      const consent = TestBed.inject(CookieConsent);
      consent.refresh();
      expect(consent.bannerVisible()).toBe(true);
      expect(consent.canUseAnalytics()).toBe(false);
    },
  );

  it('reports blocked storage without claiming the choice was saved', () => {
    const consent = TestBed.inject(CookieConsent);
    vi.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    consent.choose(false);
    expect(consent.error()).toContain('No se ha podido guardar');
    expect(consent.bannerVisible()).toBe(true);
    expect(consent.canUseAnalytics()).toBe(false);
  });

  it('reports a SecurityError while keeping analytics blocked', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(document, 'cookie', 'get').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });
    const consent = TestBed.inject(CookieConsent);
    consent.refresh();
    expect(consent.error()).toContain('no permite leer');
    expect(consent.canUseAnalytics()).toBe(false);
  });

  it('does not read or write cookies on the server', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
    const getter = vi.spyOn(document, 'cookie', 'get');
    const setter = vi.spyOn(document, 'cookie', 'set');
    const consent = TestBed.inject(CookieConsent);
    consent.refresh();
    consent.choose(true);
    expect(consent.canUseAnalytics()).toBe(false);
    expect(getter).not.toHaveBeenCalled();
    expect(setter).not.toHaveBeenCalled();
    expect(consent.bannerVisible()).toBe(false);
  });

  it('opens settings without accepting and closes without changing the choice', async () => {
    const fixture = await panel();
    const dialog: HTMLDialogElement = fixture.nativeElement.querySelector('dialog');
    // jsdom does not implement the native dialog API; real-browser checks cover focus and Escape.
    dialog.showModal = vi.fn(() => dialog.setAttribute('open', ''));
    dialog.close = vi.fn(() => dialog.removeAttribute('open'));
    fixture.componentInstance.openSettings();
    expect(dialog.open).toBe(true);
    expect(document.cookie).not.toContain(COOKIE_NAME);
    dialog.querySelector<HTMLButtonElement>('.cookie-close')!.click();
    expect(dialog.open).toBe(false);
    expect(document.cookie).not.toContain(COOKIE_NAME);
    expect(TestBed.inject(CookieConsent).bannerVisible()).toBe(true);
  });

  it('dismisses the banner without saving or accepting any cookie', async () => {
    const fixture = await panel();
    fixture.nativeElement.querySelector('.cookie-banner-dismiss').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cookie-banner')).toBeNull();
    expect(document.cookie).not.toContain(COOKIE_NAME);
    expect(TestBed.inject(CookieConsent).canUseAnalytics()).toBe(false);
  });

  it('offers accept and reject with identical classes when analytics is available', async () => {
    policy.analyticsAvailable = true;
    const fixture = await panel();
    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.cookie-actions button'),
    );
    expect(buttons[0].textContent).toContain('Rechazar opcionales');
    expect(buttons[1].textContent).toContain('Aceptar analítica');
    expect(buttons[0].className).toBe(buttons[1].className);
    expect(fixture.nativeElement.querySelector('#cookie-analytics').checked).toBe(false);
  });
});
