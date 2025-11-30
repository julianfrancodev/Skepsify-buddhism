import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { register as registerSwiperElements } from 'swiper/element/bundle';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { Storage } from '@ionic/storage-angular';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom, APP_INITIALIZER } from '@angular/core';

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from './environments/environment';

// i18n imports
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

// Función para inicializar traducciones
export function appInitializerFactory(translate: TranslateService, http: HttpClient) {
  return () => {
    // Cargar traducciones manualmente
    return Promise.all([
      http.get('/assets/i18n/es.json').toPromise().then((res: any) => translate.setTranslation('es', res)),
      http.get('/assets/i18n/en.json').toPromise().then((res: any) => translate.setTranslation('en', res)),
      http.get('/assets/i18n/pt.json').toPromise().then((res: any) => translate.setTranslation('pt', res))
    ]).then(() => translate.use('es'));
  };
}

registerSwiperElements();

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    Storage,

    // Firebase providers
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),

    // i18n provider con idioma por defecto
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'es'
      })
    ),

    // Inicializar traducciones al arrancar la app
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, HttpClient],
      multi: true
    }
  ],
});
