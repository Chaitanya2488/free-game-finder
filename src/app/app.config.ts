import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Import this

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Sets up routing
    provideHttpClient()    // Provides HttpClient for dependency injection
    // Add other providers here if needed (e.g., for state management)
  ]
};