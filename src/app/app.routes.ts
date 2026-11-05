import { Routes } from '@angular/router';
import { Home } from './home';
import { Legal } from './legal';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'aviso-legal', component: Legal, data: { document: 'notice' } },
  { path: 'privacidad', component: Legal, data: { document: 'privacy' } },
  { path: '**', component: Legal, data: { document: 'not-found' } },
];
