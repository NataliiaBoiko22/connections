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
  TuiButtonModule,
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
    TuiButtonModule,
  ],
  providers: [ThemeNightService, NgModel],
})
export class HeaderComponent extends AbstractTuiThemeSwitcher {
  night$: Observable<boolean>;
  constructor(
    private themeService: ThemeNightService,

    private router: Router
  ) {
    super(document);
    this.night$ = themeService.nightTheme$;
    this.themeService.nightTheme$.subscribe((night) => {});
  }

  get mode(): TuiBrightness | null {
    return this.themeService.isNightThemeValue() ? 'onDark' : null;
  }
  toLoginPage(): void {
    this.router.navigate(['signin']);
  }
  toProfilePage(): void {
    this.router.navigate(['profile']);
  }

  onToggleChange(): void {
    this.themeService.toggle();
  }
  toManePage(): void {
    this.router.navigate(['']);
  }
}
