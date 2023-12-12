// // notification.component.ts
// import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
// import {
//   animate,
//   state,
//   style,
//   transition,
//   trigger,
// } from '@angular/animations';
// import {
//   NotificationService,
//   ToastData,
// } from '../../services/notification.service';
// import { CommonModule } from '@angular/common';
// import { Observable, timer } from 'rxjs';
// import { take } from 'rxjs/operators';

// @Component({
//   selector: 'app-notification',
//   templateUrl: './notification.component.html',
//   styleUrls: ['./notification.component.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   standalone: true,
//   imports: [CommonModule],
//   animations: [
//     trigger('openClose', [
//       state(
//         'closed',
//         style({
//           right: '-400px',
//           transform: 'translateX(100%)',
//         })
//       ),
//       state(
//         'open',
//         style({
//           right: '40px',
//           transform: 'translateX(0)',
//         })
//       ),
//       transition('open <=> closed', [animate('2s ease-in-out')]),
//     ]),
//   ],
// })
// export class NotificationComponent implements OnInit {
//   public data$!: Observable<ToastData | null>;
//   public isOpen = false;
//   constructor(public notificationService: NotificationService) {}

//   ngOnInit() {
//     this.data$ = this.notificationService.open$;
//     this.subscribeToData();
//   }

//   private subscribeToData() {
//     this.data$.subscribe((data) => {
//       if (data) {
//         this.isOpen = true;
//         this.closeAfterDelay();
//       }
//     });
//   }

//   private closeAfterDelay() {
//     timer(2000) // Adjust the time (in milliseconds) as needed
//       .pipe(take(1))
//       .subscribe(() => {
//         this.notificationService.hide();
//       });
//   }
// }
// notification.component.ts

// Import the AnimationBuilder service
// import {
//   animate,
//   AnimationBuilder,
//   style,
//   transition,
//   trigger,
// } from '@angular/animations';
// import { CommonModule } from '@angular/common';
// import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
// import { Observable, take, timer } from 'rxjs';
// import {
//   NotificationService,
//   ToastData,
// } from '../../services/notification.service';

// @Component({
//   selector: 'app-notification',
//   templateUrl: './notification.component.html',
//   styleUrls: ['./notification.component.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   standalone: true,
//   imports: [CommonModule],
// animations: [
//   trigger('openClose', [
//     transition('void => *', [
//       style({
//         right: '-400px',
//         transform: 'translateX(100%)',
//       }),
//       animate(
//         '2s ease-in-out',
//         style({
//           right: '40px',
//           transform: 'translateX(0)',
//         })
//       ),
//     ]),
//   ]),
// ],
// })
// export class NotificationComponent implements OnInit {
//   public data$!: Observable<ToastData | null>;
//   public isOpen = false;

//   constructor(public notificationService: NotificationService) {}

//   ngOnInit() {
//     this.data$ = this.notificationService.open$;
//     this.subscribeToData();
//   }

//   private subscribeToData() {
//     this.data$.subscribe((data) => {
//       if (data) {
//         this.isOpen = true;
//         setTimeout(() => {});
//         this.closeAfterDelay();
//       }
//     });
//   }

//   private closeAfterDelay() {
//     timer(2000).subscribe(() => {
//       this.isOpen = false;

//       this.notificationService.hide();
//     });
//   }
// }

import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, take, timer } from 'rxjs';
import {
  NotificationService,
  ToastData,
} from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({
          right: '-300px',
          transform: 'translateX(100%)',
        }),
        animate(
          '0.5s ease-in-out',
          style({
            right: '20px',
            transform: 'translateX(0)',
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '2s ease-in-out',
          style({
            right: '-300px',
            transform: 'translateX(100%)',
          })
        ),
      ]),
    ]),
  ],
})
export class NotificationComponent implements OnInit {
  public data$!: Observable<ToastData | null>;
  public isOpen = false;

  constructor(public notificationService: NotificationService) {}

  ngOnInit() {
    this.data$ = this.notificationService.open$;
    this.subscribeToData();
  }

  private subscribeToData() {
    this.data$.subscribe((data) => {
      if (data) {
        this.isOpen = true;
        this.closeAfterDelay();
      }
    });
  }

  private closeAfterDelay() {
    timer(2500)
      .pipe(take(1))
      .subscribe(() => {
        this.isOpen = false;
        this.notificationService.hide();
      });
  }
}
