import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
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
  map,
  Observable,
  Subscription,
  switchMap,
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
import { transformUnixTimestampToReadableDate } from 'src/app/Store/effects/date-utils';
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
  groupMessagesData$ = this.store.select(selectGroupMessages).pipe(
    map((data) => ({
      ...data,
      Items: this.sortAndTransformMessages(data.Items),
    }))
  );
  // public groupMessagesData$!: Observable<GroupMessagesResponseBody>;
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

  ngOnInit() {
    // this.route.params.subscribe((params) => {
    //   const groupID = params['groupID'];
    //   this.groupID = groupID;
    //   console.log(this.groupID);

    //   this.store.pipe(select(selectGroupMessages)).subscribe((data) => {
    //     const isGroupMessagesEmpty = this.isGroupMessagesEmpty(data);
    //     if (isGroupMessagesEmpty) {
    //       return this.store.dispatch(
    //         setGroupMessagesData({ groupID: this.groupID })
    //       );
    //     } else {
    //       const since = this.getLastReceivedTimestamp(data);
    //       return this.store.dispatch(
    //         setGroupMessagesData({ groupID: this.groupID, since: since })
    //       );
    //     }
    //     // this.groupMessagesData$ = this.store.select(selectGroupMessages);
    //     // this.groupMessagesData$ = this.store.select(selectGroupMessages).pipe(
    //     //   map((data) => ({
    //     //     ...data,
    //     //     Items: this.sortMessages(data.Items),
    //     //   }))
    //     // );
    //   });
    // });
    this.route.params
      .pipe(
        switchMap((params) => {
          const groupID = params['groupID'];
          this.groupID = groupID;
          console.log(this.groupID);

          return this.store.pipe(select(selectGroupMessages), take(1));
        })
      )
      .subscribe((data) => {
        if (this.isGroupMessagesEmpty(data)) {
          this.store.dispatch(setGroupMessagesData({ groupID: this.groupID }));
        }
      });
    this.route.queryParams.subscribe((queryParams) => {
      this.createdBy = queryParams['createdBy'];
    });
    console.log('this.groupMessagesData$', this.groupMessagesData$);
    this.observeCountdown();
  }

  // private getLastReceivedMessage(
  //   groupMessages: GroupMessagesResponseBody
  // ): number {
  //   // Assuming that the messages are sorted by timestamp and the last message is the most recent
  //   const lastMessage = this.getLastReceivedTimestamp(groupMessages);
  //   console.log('lastMessage', lastMessage);
  //   return lastMessage ? lastMessage : 0;
  // }
  // private getLastReceivedTimestamp(
  //   groupMessages: GroupMessagesResponseBody
  // ): number {
  //   let maxTimestamp = 0;

  //   for (const message of groupMessages.Items) {
  //     const timestamp = Number(message.createdAt.S);
  //     console.log('timestamp', message.createdAt.S);
  //     if (timestamp > maxTimestamp) {
  //       maxTimestamp = timestamp;
  //     }
  //   }

  //   return maxTimestamp;
  // }
  private observeCountdown() {
    this.countdownService.getCountdownGroupMessages().subscribe((countdown) => {
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

      this.countdownService.setCountdownGroupMessages(countdownValue);
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
    console.log('onUpdateGroupsDialogButton');
    // this.store.dispatch(setGroupMessagesData({ groupID: this.groupID }));
    // this.groupMessagesData$ = this.store.select(selectGroupMessages);
    this.route.params
      .pipe(
        switchMap((params) => {
          const groupID = params['groupID'];
          this.groupID = groupID;
          return this.store.pipe(select(selectGroupMessages), take(1));
        })
      )
      .subscribe((data) => {
        const since = data.Items[0].lastTimestamp;
        console.log(' const sinc from ngOnInit ', since);
        this.store.dispatch(
          setGroupMessagesData({ groupID: this.groupID, since: since })
        );
      });
    this.route.queryParams.subscribe((queryParams) => {
      this.createdBy = queryParams['createdBy'];
    });
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
    this.sendMessageForm.reset();
  }
  public isCurrentUserMessage(item: GroupMessage): boolean {
    return item.authorID.S === this.currentUserId;
  }

  public isCurrentUserGroupCreator(): boolean {
    return this.createdBy === this.userId;
  }
  private sortAndTransformMessages(messages: GroupMessage[]): GroupMessage[] {
    const sortedMessages = this.sortMessages(messages);

    return sortedMessages.map((message) => ({
      ...message,
      createdAt: {
        S: transformUnixTimestampToReadableDate(message.createdAt.S),
      },
    }));
  }
  sortMessages(messages: GroupMessage[]): GroupMessage[] {
    const mutableMessages = [...messages];

    return mutableMessages.sort((a, b) => {
      // const timeA = new Date(a.createdAt.S).getTime();
      // const timeB = new Date(b.createdAt.S).getTime();
      const timeA = Number(a.createdAt.S);
      const timeB = Number(b.createdAt.S);

      return timeA - timeB;
    });
  }
}
