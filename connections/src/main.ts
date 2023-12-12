import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import {
  TuiAlertModule,
  TuiButtonModule,
  TuiDialogModule,
  TuiLoaderModule,
  tuiLoaderOptionsProvider,
  TuiModeModule,
  TuiRootModule,
  TuiThemeNightModule,
} from '@taiga-ui/core';
import { ErrorHandler, importProvidersFrom, isDevMode } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routes } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideStore, StoreModule } from '@ngrx/store';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { connectionsReducer } from './app/Store/reducers/reducers';
import { ConnectionsEffects } from './app/Store/effects/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TuiPromptModule } from '@taiga-ui/kit';
// import { CustomErrorHandler } from './app/shared/services/custom-error-handler.service';
// import { CustomErrorHandler } from './app/shared/services/custom-error-handler.service';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      StoreModule.forFeature('connectionsState', connectionsReducer),
      BrowserModule,
      BrowserAnimationsModule,
      RouterModule.forRoot(routes),
      TuiRootModule,
      TuiDialogModule,
      TuiPromptModule,
      TuiAlertModule,
      TuiThemeNightModule,
      TuiModeModule,
      TuiLoaderModule,
      StoreModule.forRoot({}),
      EffectsModule.forRoot([ConnectionsEffects])
    ),
    // {
    //   provide: ErrorHandler,
    //   useClass: CustomErrorHandler,
    // },
    HttpClientModule,
    provideHttpClient(),
    provideAnimations(),

    // withInterceptors([
    //   loggerInterceptor,
    //   // They can be inlined too, with full type safety!
    //   (req, next) => next(req),
    // ])
    provideStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
    provideEffects(),
  ],
}).catch((err) => console.error(err));
