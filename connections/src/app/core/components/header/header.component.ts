import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { TuiAppBarModule } from '@taiga-ui/addon-mobile';
import {
  TuiBrightness,
  TuiModeModule,
  TuiThemeNightModule,
} from '@taiga-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ThemeNightService } from 'src/app/shared/services/theme-night.service';
import { TuiToggleModule } from '@taiga-ui/kit';
import { TuiIconModule } from '@taiga-ui/experimental';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { AbstractTuiThemeSwitcher } from '@taiga-ui/cdk';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    TuiAppBarModule,
    TuiThemeNightModule,
    FormsModule,
    ReactiveFormsModule,
    TuiToggleModule,
    TuiIconModule,
    RouterModule,
    TuiModeModule,
  ],
  providers: [ThemeNightService, NgModel],
})
export class HeaderComponent extends AbstractTuiThemeSwitcher {
  night$: Observable<boolean>;
  constructor(
    @Inject(ThemeNightService) readonly night: ThemeNightService,
    private router: Router
  ) {
    super(document);
    this.night$ = night.nightTheme$;
  }
  get mode(): TuiBrightness | null {
    return this.night.nightTheme$ ? 'onDark' : 'onLight';
  }
  toLoginPage() {
    this.router.navigate(['signin']);
  }
  toProfilePage() {
    this.router.navigate(['profile']);
  }
  onToggleChange(): void {
    this.night.toggle();
    // this.nightMode = newValue;
  }
}
