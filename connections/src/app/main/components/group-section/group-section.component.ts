import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TuiButtonModule, TuiDialogModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { BehaviorSubject, interval, Subscription, take } from 'rxjs';
import {
  GroupListResponseBody,
  RequestGroupItem,
} from 'src/app/shared/models/groups-model';
import { createGroup, deleteGroup } from 'src/app/Store/actions/actions';
import {
  selectCreatedGroupList,
  selectGroupList,
} from 'src/app/Store/selectors/selectors';
import { CountdownService } from '../../services/countdown.service';

@Component({
  selector: 'app-group-section',
  templateUrl: './group-section.component.html',
  styleUrls: ['./group-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiDialogModule,
    TuiInputModule,
  ],
})
export class GroupSectionComponent implements OnInit {
  userId = localStorage.getItem('uid') as string;

  patterns = {
    PATTERN_NAME: /^[a-zA-Z0-9\s]{1,30}$/,
  };
  public groupListData$ = this.store.select(selectGroupList);
  public createdGroupListData$ = this.store.select(selectCreatedGroupList);
  public countdown$ = new BehaviorSubject<number>(0);
  public isCountdownActive = false;
  showDeleteButton = false;
  private countdownSubscription!: Subscription;
  constructor(
    private store: Store,
    private countdownService: CountdownService,
    private router: Router
  ) {
    this.createGroupForm.valueChanges.subscribe(() => {
      this.createGroupForm.markAsTouched();
    });
  }
  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.store.pipe(select(selectGroupList), take(1)).subscribe((data) => {
      const isGroupListEmpty = this.isGroupListEmpty(data);
      if (isGroupListEmpty) {
        this.store.dispatch({ type: '[Group List] Set Group List Data' });
      }
    });

    this.groupListData$ = this.store.select(selectGroupList);
    this.checkOwnGroup();
    this.observeCountdown();
  }

  private isGroupListEmpty(data: GroupListResponseBody): boolean {
    return (
      !data || (data.Count === 0 && (!data.Items || data.Items.length === 0))
    );
  }
  private checkOwnGroup() {
    this.groupListData$.subscribe((groupListData) => {
      const check = (this.showDeleteButton =
        groupListData && groupListData.Items
          ? groupListData.Items.some((createdItem) =>
              this.isCurrentUserGroupCreator(createdItem.createdBy.S)
            )
          : false);
      if (check) this.showDeleteButton = true;
    });
  }

  public isCurrentUserGroupCreator(createdBy: string): boolean {
    return createdBy === this.userId;
  }
  private observeCountdown() {
    this.countdownService.getCountdownGroups().subscribe((countdown) => {
      this.countdown$.next(countdown);
      this.isCountdownActive = countdown !== null && countdown > 0;
    });
  }
  onUpdateGroupsButton(): void {
    this.store.dispatch({ type: '[Group List] Set Group List Data' });
    this.groupListData$ = this.store.select(selectGroupList);
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

      this.countdownService.setCountdownGroups(countdownValue);
    });
  }

  //////////////////////////////////////////////////
  createGroupForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(this.patterns.PATTERN_NAME),
    ]),
  });

  open = false;
  onOpenModalButton(): void {
    this.open = true;
  }

  onCreateGroupButton(): void {
    const data = this.createGroupForm.value as RequestGroupItem;
    this.store.dispatch(createGroup({ name: data.name }));
  }
  onDeleteGroup(groupId: string): void {
    console.log('groupId', groupId);
    this.store.dispatch(deleteGroup({ groupID: groupId }));
    this.groupListData$ = this.store.select(selectGroupList);
  }

  onGroupDialogPage(groupID: string) {
    this.router.navigate(['/group', groupID]);
  }
}
