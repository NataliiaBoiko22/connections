import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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
import { BehaviorSubject, interval, map, switchMap, take } from 'rxjs';
import {
  GroupMessage,
  GroupMessagesResponseBody,
} from 'src/app/shared/models/group-messages-model';

import {
  deleteGroup,
  sendGroupMessagesData,
  setGroupMessagesData,
} from 'src/app/Store/actions/actions';
import { transformUnixTimestampToReadableDate } from 'src/app/Store/effects/effect-utils';
import { selectGroupMessagesById } from 'src/app/Store/selectors/selectors';
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
  public currentUserId = localStorage.getItem('uid') as string;
  public countdown$ = new BehaviorSubject<number>(0);
  public isCountdownActive = false;
  public groupID!: string;
  public createdBy!: string;
  public name!: string;
  public groupMessagesData$ = this.store
    .select(selectGroupMessagesById(this.groupID))
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
    this.sendMessageForm.valueChanges.subscribe(() => {
      this.sendMessageForm.markAsTouched();
    });
  }

  sendMessageForm = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          const groupID = params['groupID'];
          this.groupID = groupID;
          return this.store.pipe(
            select(selectGroupMessagesById(this.groupID)),
            take(1)
          );
        })
      )
      .subscribe((data) => {
        if (!data) {
          this.store.dispatch(setGroupMessagesData({ groupID: this.groupID }));
        }
        if (data) {
          this.store.dispatch(
            setGroupMessagesData({
              groupID: this.groupID,
              since: data.lastTimestampInGroup,
            })
          );
        }

        this.groupMessagesData$ = this.store
          .pipe(select(selectGroupMessagesById(this.groupID)))
          .pipe(
            map((data) => ({
              ...data,
              Items: data ? this.sortAndTransformMessages(data.Items) : [],
            }))
          );
      });
    this.route.queryParams.subscribe((queryParams) => {
      this.createdBy = queryParams['createdBy'];
      this.name = queryParams['name'];
    });
    this.countdown$ = this.countdownService.getCountdownForGroupDialog(
      this.groupID
    );
    this.observeCountdown();
  }

  private observeCountdown() {
    this.countdown$.subscribe((countdown) => {
      this.isCountdownActive = countdown !== null && countdown > 0;
    });
  }
  private initializeCountdowns(
    groupID: string,
    lastTimestampInGroup: number
  ): void {
    const countdown$ =
      this.countdownService.getCountdownForGroupDialog(groupID);

    if (!countdown$.value) {
      this.countdownService.setCountdownForGroupDialog(
        groupID,
        lastTimestampInGroup
      );
      this.startCountdown(groupID, lastTimestampInGroup);
    }
  }

  private startCountdown(groupID: string, lastTimestampInGroup: number): void {
    const countdown$ =
      this.countdownService.getCountdownForGroupDialog(groupID);

    if (countdown$) {
      const startTime = Math.floor(new Date().getTime() / 1000);
      const initialElapsedTime = Math.max(
        0,
        Math.min(60, 60 - (startTime - lastTimestampInGroup))
      );

      countdown$.next(initialElapsedTime);

      const countdownSubscription = interval(1000).subscribe(() => {
        const currentTime = Math.floor(new Date().getTime() / 1000);
        const elapsedTime = currentTime - startTime;

        const countdownValue = Math.max(0, Math.min(60, 60 - elapsedTime));
        countdown$.next(countdownValue);
        this.countdownService.setCountdownForGroupDialog(
          groupID,
          countdownValue
        );

        if (countdownValue <= 0) {
          countdownSubscription.unsubscribe();
        }
        this.cdRef.detectChanges();
      });
    }
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
    this.store
      .pipe(select(selectGroupMessagesById(this.groupID)), take(1))
      .subscribe((data) => {
        if (
          data.lastTimestampInGroup !== undefined &&
          data.lastTimestampInGroup > 0
        ) {
          this.store.dispatch(
            setGroupMessagesData({
              groupID: this.groupID,
              since: data.lastTimestampInGroup,
            })
          );

          this.store
            .pipe(select(selectGroupMessagesById(this.groupID)), take(1))
            .subscribe((updatedData) => {
              this.countdown$ =
                this.countdownService.getCountdownForGroupDialog(this.groupID);

              this.initializeCountdowns(
                this.groupID,
                updatedData.lastTimestampInGroup!
              );
            });
          return;
        } else {
          this.countdown$ = this.countdownService.getCountdownForGroupDialog(
            this.groupID
          );

          this.initializeCountdowns(this.groupID, data.lastTimestampInGroup!);
          return;
        }
      });
  }

  onDeleteGroupsDialogButton(): void {
    this.store.dispatch(
      deleteGroup({ groupID: this.groupID, name: this.name })
    );
    this.router.navigate(['']);
  }
  onSendMessage() {
    if (this.sendMessageForm.invalid) {
      return;
    }
    const message = this.sendMessageForm.get('message')?.value as string;
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
    return this.createdBy === this.currentUserId;
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
      const timeA: number = Number(a.createdAt.S);
      const timeB: number = Number(b.createdAt.S);

      return timeA - timeB;
    });
  }
}
