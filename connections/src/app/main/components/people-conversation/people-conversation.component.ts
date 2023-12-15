import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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
import { BehaviorSubject, interval, map, switchMap, take } from 'rxjs';
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
import { selectPeopleMessagesById } from 'src/app/Store/selectors/selectors';
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
  public conversationID!: string;
  public createdBy!: string;
  public peopleMessagesData$ = this.store
    .select(selectPeopleMessagesById(this.conversationID))
    .pipe(
      map((data) => ({
        ...data,
        Items: this.sortAndTransformMessages(data.Items),
      }))
    );

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private countdownService: CountdownService,
    private cdRef: ChangeDetectorRef
  ) {
    this.sendPeopleMessageForm.valueChanges.subscribe(() => {
      this.sendPeopleMessageForm.markAsTouched();
    });
  }
  sendPeopleMessageForm = new FormGroup({
    peopleMessage: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          const conversationID = params['conversationID'];
          this.conversationID = conversationID;
          console.log(this.conversationID);

          return this.store.pipe(
            select(selectPeopleMessagesById(this.conversationID)),
            take(1)
          );
        })
      )
      .subscribe((data) => {
        console.log('data ngOnInit PeopleConversationComponent', data);
        if (!data) {
          this.store.dispatch(
            setPeopleMessagesData({ conversationID: this.conversationID })
          );
        } else {
          this.store.dispatch(
            setPeopleMessagesData({
              conversationID: this.conversationID,
              since: data.lastTimestampInPeople,
            })
          );
        }

        this.peopleMessagesData$ = this.store
          .pipe(select(selectPeopleMessagesById(this.conversationID)))
          .pipe(
            map((data) => ({
              ...data,
              Items: data ? this.sortAndTransformMessages(data.Items) : [],
            }))
          );
      });
    this.route.queryParams.subscribe((queryParams) => {
      this.createdBy = queryParams['createdBy'];
    });
    console.log('this.peopleMessagesData$', this.peopleMessagesData$);
    this.countdown$ = this.countdownService.getCountdownForPeopleConversation(
      this.conversationID
    );
    this.observeCountdown();
  }

  private observeCountdown() {
    this.countdown$.subscribe((countdown) => {
      this.isCountdownActive = countdown !== null && countdown > 0;
    });
  }
  private initializeCountdowns(
    conversationID: string,
    lastTimestampInPeople: number
  ): void {
    const countdown$ =
      this.countdownService.getCountdownForPeopleConversation(conversationID);
    if (!countdown$.value) {
      this.countdownService.setCountdownForPeopleConversation(
        conversationID,
        lastTimestampInPeople
      );

      this.startCountdown(conversationID, lastTimestampInPeople);
    }
  }
  private startCountdown(
    conversationID: string,
    lastTimestampInPeople: number
  ): void {
    const countdown$ =
      this.countdownService.getCountdownForPeopleConversation(conversationID);
    if (countdown$) {
      const startTime = Math.floor(new Date().getTime() / 1000);
      const initialElapsedTime = Math.max(
        0,
        Math.min(60, 60 - (startTime - lastTimestampInPeople))
      );

      countdown$.next(initialElapsedTime);
      const countdownSubscription = interval(1000).subscribe(() => {
        const currentTime = Math.floor(new Date().getTime() / 1000);
        const elapsedTime = currentTime - startTime;

        const countdownValue = Math.max(0, Math.min(60, 60 - elapsedTime));
        this.countdown$.next(countdownValue);
        this.countdownService.setCountdownForPeopleConversation(
          conversationID,
          countdownValue
        );

        if (countdownValue <= 0) {
          countdownSubscription.unsubscribe();
        }
        this.cdRef.detectChanges();
      });
    }
  }

  public isCurrentUserMessage(item: PeopleMessage): boolean {
    return item.authorID.S === this.currentUserId;
  }
  public isGroupMessagesEmpty(data: PeopleMessagesResponseBody): boolean {
    return (
      !data || (data.Count === 0 && (!data.Items || data.Items.length === 0))
    );
  }
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
    this.store
      .pipe(select(selectPeopleMessagesById(this.conversationID)), take(1))
      .subscribe((data) => {
        if (
          data.lastTimestampInPeople !== undefined &&
          data.lastTimestampInPeople > 0
        ) {
          this.store.dispatch(
            setPeopleMessagesData({
              conversationID: this.conversationID,
              since: data.lastTimestampInPeople,
            })
          );

          this.store
            .pipe(
              select(selectPeopleMessagesById(this.conversationID)),
              take(1)
            )
            .subscribe((updatedData) => {
              console.log('.subscribe((updatedData)', updatedData);
              this.countdown$ =
                this.countdownService.getCountdownForPeopleConversation(
                  this.conversationID
                );

              this.initializeCountdowns(
                this.conversationID,
                updatedData.lastTimestampInPeople!
              );
            });
          return;
        }
        if (data.lastTimestampInPeople === 0) {
          this.countdown$ =
            this.countdownService.getCountdownForPeopleConversation(
              this.conversationID
            );

          this.initializeCountdowns(
            this.conversationID,
            data.lastTimestampInPeople
          );
          return;
        }
      });
  }

  onSendMessagePeople() {
    if (this.sendPeopleMessageForm.invalid) {
      return;
    }
    const message = this.sendPeopleMessageForm.get('peopleMessage')
      ?.value as string;

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
