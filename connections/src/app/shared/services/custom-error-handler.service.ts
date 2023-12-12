import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { delay, switchMap, take } from 'rxjs';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  constructor(private dialogService: TuiDialogService, private zone: NgZone) {}
  handleError(error: unknown): void {
    console.log('CUSTOM handleError(error: unknown): void');
    this.zone.run(() => {
      this.dialogService
        .open(`${error}`, {
          label: 'Error',
          size: 's',
        })
        .subscribe();

      setTimeout(() => {
        this.dialogService.subscribe();
      }, 3000);
    });
  }
}
