import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import {
  TuiButtonModule,
  TuiDialogModule,
  TuiErrorModule,
} from '@taiga-ui/core';
import { TuiFieldErrorPipeModule, TuiInputModule } from '@taiga-ui/kit';
import {
  BehaviorSubject,
  interval,
  Observable,
  Subscription,
  take,
  tap,
} from 'rxjs';
import {
  GroupMessage,
  GroupMessagesResponseBody,
} from 'src/app/shared/models/group-messages';
import { ResponseGroupID } from 'src/app/shared/models/groups-model';
import {
  deleteGroup,
  sendGroupMessagesData,
  setGroupMessagesData,
} from 'src/app/Store/actions/actions';
import {
  selectGroupMessages,
  selectProfileData,
} from 'src/app/Store/selectors/selectors';
import { CountdownService } from '../../services/countdown.service';

@Component({
  selector: 'app-group-dialog',
  templateUrl: './group-dialog.component.html',
  styleUrls: ['./group-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiDialogModule,
    TuiInputModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
  ],
})
export class GroupDialogComponent implements OnInit {
  userId = localStorage.getItem('uid') as string;

  public countdown$ = new BehaviorSubject<number>(0);
  public isCountdownActive = false;
  private countdownSubscription!: Subscription;

  public groupMessagesData$!: Observable<GroupMessagesResponseBody>;
  public groupID!: string;
  public createdBy!: string;

  public currentUserId = localStorage.getItem('uid') as string;
  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private countdownService: CountdownService
  ) {
    this.sendMessageForm.valueChanges.subscribe(() => {
      this.sendMessageForm.markAsTouched();
    });
  }

  sendMessageForm = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });
  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      const groupID = params['groupID'];
      this.groupID = groupID;
      console.log(this.groupID);

      this.store
        .pipe(
          select(selectGroupMessages),
          tap((data) => console.log('Data from selectGroupMessages:', data))
        )
        .subscribe((data) => {
          const isGroupMessagesEmpty = this.isGroupMessagesEmpty(data);
          if (isGroupMessagesEmpty) {
            this.store.dispatch(setGroupMessagesData({ groupID }));
          }
          // this.groupMessagesData$ = this.store.select(selectGroupMessages);
        });
      this.groupMessagesData$ = this.store.select(selectGroupMessages);
    });
    // this.groupMessagesData$ = this.store.select(selectGroupMessages);
    this.route.queryParams.subscribe((queryParams) => {
      this.createdBy = queryParams['createdBy'];
    });
    console.log('this.groupMessagesData$', this.groupMessagesData$);
    this.observeCountdown();
  }
  private observeCountdown() {
    this.countdownService
      .getCountdown('groupsMessages')
      .subscribe((countdown) => {
        this.countdown$.next(countdown);
        this.isCountdownActive = countdown !== null && countdown > 0;
      });
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

      this.countdownService.setCountdown('groupsMessages', countdownValue);
    });
  }

  public isGroupMessagesEmpty(data: GroupMessagesResponseBody): boolean {
    return (
      !data || (data.Count === 0 && (!data.Items || data.Items.length === 0))
    );
  }
  onBackToMainButton() {
    this.router.navigate(['']);
  }
  onUpdateGroupsDialogButton(): void {
    this.store.dispatch({ type: '[Group List] Set Group List Data' });
    this.groupMessagesData$ = this.store.select(selectGroupMessages);
    this.startCountdown();
  }

  onDeleteGroupsDialogButton(): void {
    this.store.dispatch(deleteGroup({ groupID: this.groupID }));
    this.router.navigate(['']);
  }
  onSendMessage() {
    if (this.sendMessageForm.invalid) {
      console.log(' if (this.sendMessageForm.invalid)');
      return;
    }
    const message = this.sendMessageForm.get('message')?.value as string;
    console.log('onSendMessage', { groupID: this.groupID, message });
    this.store.dispatch(
      sendGroupMessagesData({
        groupID: this.groupID,
        authorID: this.currentUserId,
        message,
      })
    );
  }
  public isCurrentUserMessage(item: GroupMessage): boolean {
    return item.authorID.S === this.currentUserId;
  }

  public isCurrentUserGroupCreator(): boolean {
    return this.createdBy === this.userId;
  }
}
