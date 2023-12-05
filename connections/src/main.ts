import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import {
  TuiAlertModule,
  TuiButtonModule,
  TuiDialogModule,
  TuiModeModule,
  TuiRootModule,
  TuiThemeNightModule,
} from '@taiga-ui/core';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routes } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { provideStore, StoreModule } from '@ngrx/store';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { connectionsReducer } from './app/Store/reducers/reducers';
import { ConnectionsEffects } from './app/Store/effects/effects';
import {
  provideStoreDevtools,
  StoreDevtoolsModule,
} from '@ngrx/store-devtools';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    importProvidersFrom(
      StoreModule.forFeature('connectionsState', connectionsReducer),
      BrowserModule,
      BrowserAnimationsModule,
      RouterModule.forRoot(routes),
      HttpClientModule,
      TuiRootModule,
      TuiDialogModule,
      TuiAlertModule,
      TuiThemeNightModule,
      TuiModeModule,
      StoreModule.forRoot({}),
      EffectsModule.forRoot([ConnectionsEffects])
    ),

    provideStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
    provideEffects(),
  ],
}).catch((err) => console.error(err));
