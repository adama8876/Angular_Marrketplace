import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';



import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"marketplaceproject-a018b","appId":"1:567376228596:web:6669461dc71916293daea1","storageBucket":"marketplaceproject-a018b.appspot.com","apiKey":"AIzaSyAlRVO7FU4Bq-HpumgGTN8j0O36tKCeFXw","authDomain":"marketplaceproject-a018b.firebaseapp.com","messagingSenderId":"567376228596"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideMessaging(() => getMessaging())]
};