import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  constructor(private dialogService: TuiDialogService, private zone: NgZone) {}
  handleError(error: unknown): void {
    this.zone.run(() => {
      this.dialogService
        .open(`${error}`, {
          label: 'Error',
          size: 's',
        })
        .subscribe();

      setTimeout(() => {
        this.dialogService.subscribe();
      }, 2000);
    });
  }
}
