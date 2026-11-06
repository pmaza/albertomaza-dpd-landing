import { Routes } from '@angular/router';
import { Home } from './home';
import { Legal } from './legal';
import { CookiePolicyPage } from './cookie-policy';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'aviso-legal', component: Legal, data: { document: 'notice' } },
  { path: 'privacidad', component: Legal, data: { document: 'privacy' } },
  { path: 'cookies', component: CookiePolicyPage },
  { path: '**', component: Legal, data: { document: 'not-found' } },
];
