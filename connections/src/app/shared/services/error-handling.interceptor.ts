import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // return next.handle(request);
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error:', error);
        // Handle the error or rethrow it
        return throwError(error);
      })
    );
  }
}
