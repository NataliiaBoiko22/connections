import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiDialogService } from '@taiga-ui/core';
import { EMPTY, Observable, switchMap, throwError } from 'rxjs';
import { HttpError } from 'src/app/shared/models/http-model';
import { setEmailError } from 'src/app/Store/actions/actions';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorService {
  constructor(private dialogService: TuiDialogService, private store: Store) {}

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
    return throwError(
      () => new Error('Something bad happened; please try again.')
    );
  }

  handleHttpError<T>(err: HttpErrorResponse): Observable<T> {
    this.store.dispatch(setEmailError({ emailError: true }));

    return this.catchErrors(err).pipe(switchMap(() => EMPTY));
  }
}
