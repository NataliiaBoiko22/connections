import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiRootModule, TuiNotificationModule } from '@taiga-ui/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ TuiRootModule, TuiNotificationModule]


})
export class NotificationComponent {

}
