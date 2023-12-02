import { TuiRootModule, TuiDialogModule, TuiAlertModule, TuiBrightness } from "@taiga-ui/core";
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiModeModule} from '@taiga-ui/core';
import { ThemeNightService } from "./shared/services/theme-night.service";
import { CommonModule } from '@angular/common';
import { Observable } from "rxjs";
import { RouterModule } from "@angular/router";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { SigninComponent } from "./auth/components/signin/signin.component";
import { SignupComponent } from "./auth/components/signup/signup.component";
import { HeaderComponent } from "./core/components/header/header.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
    imports: [CommonModule, RouterModule, HeaderComponent, TuiRootModule, TuiDialogModule, TuiAlertModule,
       TuiModeModule, SigninComponent, SignupComponent],
    providers: [ThemeNightService, HttpClientModule, HttpClient
  ]
})
export class AppComponent {
  title = 'connections';
  night$: Observable<boolean>; 
  constructor(@Inject(ThemeNightService) readonly night: ThemeNightService,
 ) {
  this.night$ = night.nightTheme$;
}
 
  get mode(): TuiBrightness | null {
    return this.night.nightTheme$ ? 'onDark' : null;
  }
}
