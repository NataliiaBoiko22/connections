import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';
import { GroupListResponseBody } from 'src/app/shared/models/groups-model';
import { selectGroupList } from 'src/app/Store/selectors/selectors';
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
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.groupService.fetchGroups();
    this.groupListData$ = this.store.select(selectGroupList);
    console.log('this.groupListData$', this.groupListData$);
  }

  // onUpdateButton(): void {
  //   this.groupService.fetchGroups();
  //   this.groupListData$ = this.store.select(selectGroupList);
  //   console.log('this.groupListData$', this.groupListData$);
  // }
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
      this.countdown$.next(this.countdown$.value - 1);
      if (this.countdown$.value <= 0) {
        if (this.countdownSubscription) {
          this.countdownSubscription.unsubscribe();
        }
      }
      this.cd.detectChanges();
    });
  }
}
