import { provideAnimations } from "@angular/platform-browser/animations";
import { TuiAlertModule, TuiDialogModule, TuiModeModule, TuiRootModule, TuiThemeNightModule } from "@taiga-ui/core";
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routes } from './app/app-routing.module';
import { AppComponent } from './app/app.component';


bootstrapApplication(AppComponent, 
 { providers:[
     provideAnimations(),
    importProvidersFrom(RouterModule.forRoot(routes), TuiRootModule,
      TuiDialogModule, TuiAlertModule,
      TuiThemeNightModule,
      TuiModeModule,
    )
  ]})
.catch(err => console.error(err));
