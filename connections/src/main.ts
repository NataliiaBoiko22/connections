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
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideStore, StoreModule } from '@ngrx/store';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { connectionsReducer } from './app/Store/reducers/reducers';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TuiPromptModule } from '@taiga-ui/kit';
import { AuthEffects } from './app/Store/effects/auth.effects';
import { GroupEffects } from './app/Store/effects/group.effects';
import { PeopleEffects } from './app/Store/effects/people.effects';
import { GroupDialogEffects } from './app/Store/effects/group-dialog.effects';
import { PeopleConversationEffects } from './app/Store/effects/people-conversation.effects';
import { ErrorHandlingInterceptor } from './app/shared/services/error-handling.interceptor';
import { CustomErrorHandler } from './app/shared/services/custom-error-handler.service';
import { ThemeNightService } from './app/shared/services/theme-night.service';

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
      EffectsModule.forRoot([
        AuthEffects,
        GroupEffects,
        PeopleEffects,
        GroupDialogEffects,
        PeopleConversationEffects,
      ]),

      ThemeNightService
    ),

    // {
    //   provide: ErrorHandler,
    //   useClass: CustomErrorHandler,
    // },
    HttpClientModule,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),

    provideStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
    provideEffects(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlingInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
