import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  inject,
  Injectable,
  InjectionToken,
  PLATFORM_ID,
  signal,
} from '@angular/core';

export const COOKIE_NAME = 'am_privacy_preferences';
export const COOKIE_MAX_AGE = 180 * 24 * 60 * 60;
export const COOKIE_POLICY_VERSION = '2026-11-06.1';

export interface CookiePolicy {
  version: string;
  analyticsAvailable: boolean;
}

export const COOKIE_POLICY = new InjectionToken<CookiePolicy>('Cookie policy', {
  providedIn: 'root',
  factory: () => ({ version: COOKIE_POLICY_VERSION, analyticsAvailable: false }),
});

interface ConsentRecord {
  version: string;
  necessary: true;
  analytics: boolean;
  updatedAt: number;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class CookieConsent {
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly policy = inject(COOKIE_POLICY);
  private readonly visible = signal(false);
  private readonly storageError = signal('');
  readonly bannerVisible = this.visible.asReadonly();
  readonly error = this.storageError.asReadonly();

  constructor() {
    afterNextRender(() => this.refresh());
  }

  get globalPrivacyControl(): boolean {
    const navigator = this.document.defaultView?.navigator;
    return !!navigator && Reflect.get(navigator, 'globalPrivacyControl') === true;
  }

  canUseAnalytics(): boolean {
    if (
      !this.browser ||
      !this.policy.analyticsAvailable ||
      this.globalPrivacyControl ||
      this.storageError()
    )
      return false;
    const record = this.readRecord();
    return record?.analytics === true;
  }

  refresh(): void {
    if (!this.browser) return;
    const record = this.readRecord();
    this.visible.set(record === null);
  }

  analyticsSelected(): boolean {
    return this.canUseAnalytics();
  }

  dismissBanner(): void {
    this.visible.set(false);
  }

  choose(analytics: boolean): void {
    if (!this.browser) return;
    this.storageError.set('');
    const updatedAt = Date.now();
    const record: ConsentRecord = {
      version: this.policy.version,
      necessary: true,
      analytics: analytics && this.policy.analyticsAvailable && !this.globalPrivacyControl,
      updatedAt,
      expiresAt: updatedAt + COOKIE_MAX_AGE * 1000,
    };
    const value = encodeURIComponent(JSON.stringify(record));
    const secure = this.document.location.protocol === 'https:' ? '; Secure' : '';
    try {
      this.document.cookie = `${COOKIE_NAME}=${value}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== 'SecurityError') throw error;
      console.error('No se puede guardar la preferencia de cookies.', error);
    }
    const persisted = this.readRecord();
    if (!persisted || JSON.stringify(persisted) !== JSON.stringify(record)) {
      this.storageError.set(
        'No se ha podido guardar tu elección. Las cookies opcionales siguen bloqueadas. Comprueba si tu navegador permite cookies propias.',
      );
      this.visible.set(true);
      return;
    }
    this.visible.set(false);
  }

  private readRecord(): ConsentRecord | null {
    let cookie: string;
    try {
      cookie = this.document.cookie;
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== 'SecurityError') throw error;
      console.error('No se puede leer la preferencia de cookies.', error);
      this.storageError.set(
        'Tu navegador no permite leer las preferencias. Las cookies opcionales siguen bloqueadas.',
      );
      return null;
    }
    const raw = cookie
      .split('; ')
      .find((entry) => entry.startsWith(`${COOKIE_NAME}=`))
      ?.slice(COOKIE_NAME.length + 1);
    if (!raw) return null;
    let value: unknown;
    try {
      value = JSON.parse(decodeURIComponent(raw));
    } catch (error) {
      if (!(error instanceof SyntaxError) && !(error instanceof URIError)) throw error;
      console.warn('La preferencia de cookies está dañada. Es necesario elegir de nuevo.');
      return null;
    }
    if (!value || typeof value !== 'object') return null;
    const data = value as Record<string, unknown>;
    const now = Date.now();
    if (
      data['version'] !== this.policy.version ||
      data['necessary'] !== true ||
      typeof data['analytics'] !== 'boolean' ||
      typeof data['updatedAt'] !== 'number' ||
      typeof data['expiresAt'] !== 'number' ||
      !Number.isFinite(data['updatedAt']) ||
      !Number.isFinite(data['expiresAt']) ||
      data['updatedAt'] > now ||
      data['expiresAt'] <= now ||
      data['expiresAt'] <= data['updatedAt'] ||
      data['expiresAt'] - data['updatedAt'] > COOKIE_MAX_AGE * 1000 ||
      (!this.policy.analyticsAvailable && data['analytics'])
    )
      return null;
    return {
      version: this.policy.version,
      necessary: true,
      analytics: data['analytics'],
      updatedAt: data['updatedAt'],
      expiresAt: data['expiresAt'],
    };
  }
}
