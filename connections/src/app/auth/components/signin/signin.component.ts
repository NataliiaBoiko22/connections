import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiAlertModule, TuiDialogModule, TuiRootModule } from '@taiga-ui/core';
import {TuiBlockStatusModule} from '@taiga-ui/layout';
import {TuiThemeNightModule, TuiModeModule} from '@taiga-ui/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TuiRootModule, TuiDialogModule, TuiAlertModule, TuiBlockStatusModule,
    TuiThemeNightModule,
    TuiModeModule],

})
export class SigninComponent {

}
