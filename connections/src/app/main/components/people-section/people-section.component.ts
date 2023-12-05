import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PeopleListResponseBody } from 'src/app/shared/models/people-models';
import { selectPeopleList } from 'src/app/Store/selectors/selectors';
import { PeopleService } from '../../services/people.service';

@Component({
  selector: 'app-people-section',
  templateUrl: './people-section.component.html',
  styleUrls: ['./people-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class PeopleSectionComponent {
  public peopleListData$ = this.store.select(selectPeopleList);

  constructor(private peopleService: PeopleService, private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch({ type: '[People List] Set People List Data' });

    console.log('this.peopleListData$', this.peopleListData$);
  }

  onUpdateButton(): void {
    // this.peopleService.fetchPeople();
    this.peopleListData$ = this.store.select(selectPeopleList);
    console.log('this.peopleListData$', this.peopleListData$);
  }
}
