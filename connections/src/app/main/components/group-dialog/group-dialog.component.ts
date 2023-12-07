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
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { GroupMessagesResponseBody } from 'src/app/shared/models/group-messages';
import { ResponseGroupID } from 'src/app/shared/models/groups-model';
import {
  sendGroupMessagesData,
  setGroupMessagesData,
} from 'src/app/Store/actions/actions';
import { selectGroupMessages } from 'src/app/Store/selectors/selectors';

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
  public countdown$ = new BehaviorSubject<number>(0);
  public isCountdownActive = false;
  public groupMessagesData$!: Observable<GroupMessagesResponseBody>;
  public groupID!: string;
  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.sendMessageForm.valueChanges.subscribe(() => {
      this.sendMessageForm.markAsTouched();
    });
  }

  sendMessageForm = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const groupID = params['groupID'];
      this.groupID = groupID as string;
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
          this.groupMessagesData$ = this.store.select(selectGroupMessages);
        });
    });
    this.groupMessagesData$ = this.store.select(selectGroupMessages);

    console.log('this.groupMessagesData$', this.groupMessagesData$);
    // this.observeCountdown();
  }

  public isGroupMessagesEmpty(data: GroupMessagesResponseBody): boolean {
    return (
      !data || (data.Count === 0 && (!data.Items || data.Items.length === 0))
    );
  }
  onBackToMainButton() {
    this.router.navigate(['']);
  }
  onUpdateGroupsDialogButton() {
    console.log('onUpdateGroupsDialogButton');
  }
  onDeleteGroupsDialogButton() {
    console.log('onDeleteGroupsDialogButton');
  }
  onSendMessage() {
    if (this.sendMessageForm.invalid) {
      console.log(' if (this.sendMessageForm.invalid)');
      return;
    }
    const message = this.sendMessageForm.get('message')?.value as string;
    console.log('onSendMessage', { groupID: this.groupID, message });
    this.store.dispatch(
      sendGroupMessagesData({ groupID: this.groupID, message })
    );
  }
}
