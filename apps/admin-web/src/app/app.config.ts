import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';
// import Aura from '@primeuix/themes/aura';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './shared/interceptor/http-interceptor';


const PurplePreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '#F8F1FB',
      100: '#E1D2E6',
      200: '#C2A3D2',
      300: '#9E79B3',
      400: '#7A4E95',
      500: '#643278',
      600: '#4F2661',
      700: '#3A1C4D',
      800: '#2A1037',
      900: '#1A0821',
      950: '#0E0414',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
      provideHttpClient(
      withInterceptors([httpInterceptor])
    ),
    providePrimeNG({
      ripple: true,  
      theme: {
        preset: PurplePreset,
        options: {
          prefix: 'prime',
          darkModeSelector: '.dark-mode',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
  

  ],
};
