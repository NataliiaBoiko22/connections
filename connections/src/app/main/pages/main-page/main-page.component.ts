import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
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
export class MainPageComponent {}
