import { TuiRootModule, TuiDialogModule, TuiAlertModule, TuiBrightness } from "@taiga-ui/core";
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {TuiThemeNightModule, TuiModeModule} from '@taiga-ui/core';
import { ThemeNightService } from "./shared/services/theme-night.service";
import { CommonModule } from '@angular/common';
import { Observable } from "rxjs";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
    imports: [CommonModule, RouterModule, TuiRootModule, TuiDialogModule, TuiAlertModule,
      TuiThemeNightModule,
      TuiModeModule,],
    providers: [ThemeNightService]
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
