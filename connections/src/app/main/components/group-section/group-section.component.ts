import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TuiAppBarModule } from '@taiga-ui/addon-mobile';
import {
  TuiButtonModule,
  TuiDataListAccessor,
  TuiDialogModule,
} from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { BehaviorSubject, interval, Subscription, take } from 'rxjs';
import {
  GroupItem,
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
    TuiAppBarModule,
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
    this.countdownService.getCountdownGroup().subscribe((countdown) => {
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

      this.countdownService.setCountdownGroup(countdownValue);
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

  onDeleteGroup(groupId: string, name: string): void {
    this.store.dispatch(deleteGroup({ groupID: groupId, name: name }));
    this.groupListData$ = this.store.select(selectGroupList);
  }

  onGroupDialogPage(groupID: string, createdBy: string): void {
    this.router.navigate(['/group', groupID], {
      queryParams: { createdBy: createdBy },
    });
  }
  onGroupDialogPageFromNewGroup(groupID: string): void {
    console.log(' onGroupDialogPageFromNewGroup(groupID: string): void');
    this.router.navigate(['/group', groupID], {
      queryParams: { createdBy: this.userId },
    });
  }
  getSortedGroupList(groupListData: GroupListResponseBody): GroupItem[] {
    if (groupListData && groupListData.Items) {
      return groupListData.Items.slice().sort((a, b) =>
        a.name.S.localeCompare(b.name.S)
      );
    }

    return [];
  }
}
