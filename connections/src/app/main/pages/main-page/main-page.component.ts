import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
} from '@angular/core';
import { TuiBrightness } from '@taiga-ui/core';
import { Observable} from 'rxjs';
import { ThemeNightService } from 'src/app/shared/services/theme-night.service';
import { GroupSectionComponent } from '../../components/group-section/group-section.component';
import { PeopleSectionComponent } from '../../components/people-section/people-section.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, GroupSectionComponent, PeopleSectionComponent],
})
export class MainPageComponent {
  night$: Observable<boolean>;
  constructor(@Inject(ThemeNightService) readonly night: ThemeNightService) {
    this.night$ = night.nightTheme$;
  }
  get mode(): TuiBrightness | null {
    return this.night.nightTheme$ ? 'onDark' : null;
  }

}
