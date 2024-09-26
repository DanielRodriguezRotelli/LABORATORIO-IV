import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environmentConfig } from './environmentConfig';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
              provideFirebaseApp(() => initializeApp(environmentConfig)), 
              provideAuth(() => getAuth()), 
              provideFirestore(() => getFirestore()),
              importProvidersFrom(HttpClientModule)]
};
