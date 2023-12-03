import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';
import { GroupListResponseBody } from 'src/app/shared/models/groups-model';
import { selectGroupList } from 'src/app/Store/selectors/selectors';
import { CountdownService } from '../../services/countdown.service';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-group-section',
  templateUrl: './group-section.component.html',
  styleUrls: ['./group-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class GroupSectionComponent implements OnInit {
  public groupListData$!: Observable<GroupListResponseBody>;
  public countdown$ = new BehaviorSubject<number>(0);
  private countdownSubscription: Subscription | undefined;
  constructor(
    private groupService: GroupService,
    private store: Store,
    private countdownService: CountdownService
  ) {}

  ngOnInit(): void {
    this.groupListData$ = this.store.select(selectGroupList);
    console.log('this.groupListData$', this.groupListData$);
    this.countdownService.getCountdown().subscribe((countdown) => {
      this.countdown$.next(countdown);
    });
  }

  onUpdateGroupsButton(): void {
    this.groupService.fetchGroups();
    this.groupListData$ = this.store.select(selectGroupList);
    console.log('this.groupListData$', this.groupListData$);
    this.startCountdown();
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

      this.countdownService.setCountdown(countdownValue);
    });
  }
}
