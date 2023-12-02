import { BrowserAnimationsModule, provideAnimations } from "@angular/platform-browser/animations";
import { TuiAlertModule, TuiButtonModule, TuiDialogModule, TuiModeModule, TuiRootModule, TuiThemeNightModule } from "@taiga-ui/core";
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { RouterModule } from "@angular/router";
import { routes } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from "@angular/common/http";
import { TuiInputModule, TuiInputPasswordModule } from "@taiga-ui/kit";


bootstrapApplication(AppComponent, 
 { providers:[
     provideAnimations(),
    importProvidersFrom(BrowserModule, BrowserAnimationsModule, RouterModule.forRoot(routes), HttpClientModule, TuiRootModule,
      TuiDialogModule, TuiAlertModule,
      TuiThemeNightModule,
      TuiModeModule     )
  ]})
.catch(err => console.error(err));
