import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { HttpError } from 'src/app/shared/models/http';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorService {
  constructor(private dialogService: TuiDialogService) {}

  // catchErrors(err: HttpErrorResponse, isReturnStatus?: boolean): Observable<number> | Observable<never>  {
  //   if (isReturnStatus !== undefined) {
  //     return isReturnStatus ? of(err.status) : EMPTY;
  //   } else {
  //     return EMPTY;
  //   }
  // }

  catchErrors(err: HttpErrorResponse): Observable<HttpError> {
    console.log('err fron errr service', err);
    const error: HttpError = {
      status: err.status,
      message:
        err.error.message || 'An error occurred during the HTTP request.',
      details: err.message,
    };
    this.dialogService
      .open(`<strong>${error.message}</strong>`, {
        label: 'Error',
        size: 's',
      })
      .subscribe();
    return EMPTY;
    // return throwError(error);
  }
  // handleHttpError<T>(err: HttpErrorResponse): Observable<T> {
  //   this.displayErrorDialog(err);
  //   return EMPTY;
  // }

  // private displayErrorDialog(err: HttpErrorResponse): void {
  //   const error: HttpError = {
  //     status: err.status,
  //     message: 'An error occurred during the HTTP request.',
  //     details: err.message, // You may want to customize this based on your needs
  //   };

  //   // Display the error message in a dialog using this.dialogService
  //   this.dialogService
  //     .open('Error', {
  //       label: 'Error',
  //       size: 's',
  //       data: {
  //         message: error.message,
  //       },
  //     })
  //     .subscribe();
  // }
}
