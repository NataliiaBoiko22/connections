import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  Subscription,
  switchMap,
  take,
} from 'rxjs';
import {
  PeopleMessage,
  PeopleMessagesResponseBody,
} from 'src/app/shared/models/people-messages-model';
import {
  deletePeopleConversation,
  sendPeopleMessagesData,
  setPeopleMessagesData,
} from 'src/app/Store/actions/actions';
import { transformUnixTimestampToReadableDate } from 'src/app/Store/effects/effect-utils';
import { selectPeopleMessages } from 'src/app/Store/selectors/selectors';
import { CountdownService } from '../../services/countdown.service';

@Component({
  selector: 'app-people-conversation',
  templateUrl: './people-conversation.component.html',
  styleUrls: ['./people-conversation.component.scss'],
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
export class PeopleConversationComponent {
  public currentUserId = localStorage.getItem('uid') as string;

  public countdown$ = new BehaviorSubject<number>(0);
  public isCountdownActive = false;
  private countdownSubscription!: Subscription;
  public conversationID!: string;
  public createdBy!: string;

  peopleMessagesData$ = this.store.select(selectPeopleMessages).pipe(
    map((data) => ({
      ...data,
      Items: this.sortAndTransformMessages(data.Items),
    }))
  );

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private countdownService: CountdownService
  ) {
    this.sendPeopleMessageForm.valueChanges.subscribe(() => {
      this.sendPeopleMessageForm.markAsTouched();
    });
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          const conversationID = params['conversationID'];
          this.conversationID = conversationID;
          console.log(conversationID);

          return this.store.pipe(select(selectPeopleMessages), take(1));
        })
      )
      .subscribe((data) => {
        if (this.isGroupMessagesEmpty(data)) {
          this.store.dispatch(
            setPeopleMessagesData({ conversationID: this.conversationID })
          );
        }
      });
    // this.route.queryParams.subscribe((queryParams) => {
    //   this.createdBy = queryParams['createdBy'];
    // });
    console.log('this.groupMessagesData$', this.peopleMessagesData$);
    // this.observeCountdown();
  }

  sendPeopleMessageForm = new FormGroup({
    peopleMessage: new FormControl('', [Validators.required]),
  });

  public isCurrentUserMessage(item: PeopleMessage): boolean {
    return item.authorID.S === this.currentUserId;
  }
  public isGroupMessagesEmpty(data: PeopleMessagesResponseBody): boolean {
    return (
      !data || (data.Count === 0 && (!data.Items || data.Items.length === 0))
    );
  }
  // private observeCountdown() {
  //   this.countdownService.getCountdownGroupMessages().subscribe((countdown) => {
  //     this.countdown$.next(countdown);
  //     this.isCountdownActive = countdown !== null && countdown > 0;
  //   });
  // }
  onBackToMainButton() {
    this.router.navigate(['']);
  }
  private sortAndTransformMessages(messages: PeopleMessage[]): PeopleMessage[] {
    const sortedMessages = this.sortMessages(messages);

    return sortedMessages.map((message) => ({
      ...message,
      createdAt: {
        S: transformUnixTimestampToReadableDate(message.createdAt.S),
      },
    }));
  }
  sortMessages(messages: PeopleMessage[]): PeopleMessage[] {
    const mutableMessages = [...messages];

    return mutableMessages.sort((a, b) => {
      const timeA: number = Number(a.createdAt.S);
      const timeB: number = Number(b.createdAt.S);

      return timeA - timeB;
    });
  }
  onDeletePeopleConversationButton(): void {
    this.store.dispatch(
      deletePeopleConversation({ conversationID: this.conversationID })
    );
    this.router.navigate(['']);
  }
  onUpdatePeopleConversationButton(): void {
    console.log('onUpdateGroupsDialogButton');
    // this.store.dispatch(setGroupMessagesData({ groupID: this.groupID }));
    // this.groupMessagesData$ = this.store.select(selectGroupMessages);
    this.route.params
      .pipe(
        switchMap((params) => {
          const conversationID = params['conversationID'];
          this.conversationID = conversationID;
          return this.store.pipe(select(selectPeopleMessages), take(1));
        })
      )
      .subscribe((data) => {
        const since = data.Items[0].lastTimestamp;
        console.log(' const sinc from ngOnInit ', since);
        this.store.dispatch(
          setPeopleMessagesData({
            conversationID: this.conversationID,
            since: since,
          })
        );
      });
    // this.route.queryParams.subscribe((queryParams) => {
    //   this.createdBy = queryParams['createdBy'];
    // });
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

      // this.countdownService.setCountdownGroupMessages(countdownValue);
    });
  }

  onSendMessagePeople() {
    if (this.sendPeopleMessageForm.invalid) {
      console.log(' if (this.sendMessageForm.invalid)');
      return;
    }
    const message = this.sendPeopleMessageForm.get('peopleMessage')
      ?.value as string;
    console.log('onSendMessage', { groupID: this.conversationID, message });
    this.store.dispatch(
      sendPeopleMessagesData({
        conversationID: this.conversationID,
        authorID: this.currentUserId,
        message,
      })
    );
    this.sendPeopleMessageForm.reset();
  }
}
