import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // <--- Ajouter ceci
import { routes } from './app.routes';
import { WordingService } from './core/services/wording.service';

// Fonction Factory pour le démarrage
export function initApp(wordingService: WordingService) {
  return () => wordingService.initWording();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), // <--- Indispensable pour lire les JSON
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [WordingService],
      multi: true
    }
  ]
};