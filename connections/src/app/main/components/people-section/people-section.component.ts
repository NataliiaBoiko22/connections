import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TuiButtonModule, TuiDialogModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import {
  BehaviorSubject,
  interval,
  Observable,
  Subscription,
  take,
} from 'rxjs';
import { PeopleListResponseBody } from 'src/app/shared/models/people-models';
import { selectPeopleList } from 'src/app/Store/selectors/selectors';
import { CountdownService } from '../../services/countdown.service';

@Component({
  selector: 'app-people-section',
  templateUrl: './people-section.component.html',
  styleUrls: ['./people-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TuiButtonModule, TuiDialogModule, TuiInputModule],
})
export class PeopleSectionComponent {
  public peopleListData$ = this.store.select(selectPeopleList);
  public countdown$ = new BehaviorSubject<number>(0);
  public isCountdownActive = false;
  private countdownSubscription!: Subscription;

  constructor(
    private store: Store,
    private countdownService: CountdownService
  ) {}

  ngOnInit(): void {
    // this.store.dispatch({ type: '[People List] Set People List Data' });
    this.store.pipe(select(selectPeopleList), take(1)).subscribe((data) => {
      const isPeopleListEmpty = this.isPeopleListEmpty(data);
      if (isPeopleListEmpty) {
        this.store.dispatch({ type: '[People List] Set People List Data' });
      }
    });

    // this.peopleListData$ = this.store.select(selectPeopleList);
    this.observeCountdown();
  }
  private startCountdown(): void {
    this.countdown$.next(60);
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }

    this.countdownSubscription = interval(1000).subscribe(() => {
      const countdownValue = this.countdown$.value - 1;
      this.countdown$.next(countdownValue);

      if (countdownValue <= 0 && this.countdownSubscription) {
        this.countdownSubscription.unsubscribe();
      }

      this.countdownService.setCountdownPeople(countdownValue);
    });
  }
  private observeCountdown() {
    this.countdownService.getCountdownPeople().subscribe((countdown) => {
      this.countdown$.next(countdown);
      this.isCountdownActive = countdown !== null && countdown > 0;
    });
  }

  private isPeopleListEmpty(data: PeopleListResponseBody): boolean {
    return (
      !data || (data.Count === 0 && (!data.Items || data.Items.length === 0))
    );
  }

  onUpdatePeopleButton(): void {
    this.store.dispatch({ type: '[People List] Set People List Data' });
    this.peopleListData$ = this.store.select(selectPeopleList);
    this.startCountdown();
  }
}
