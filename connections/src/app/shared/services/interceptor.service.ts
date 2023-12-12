// import { inject, Injectable } from '@angular/core';
// import {
//   HttpEvent,
//   HttpHandler,
//   HttpInterceptor,
//   HttpInterceptorFn,
//   HttpRequest,
// } from '@angular/common/http';

// import { LoaderService } from './loader.service';
// import { finalize, Observable } from 'rxjs';
// @Injectable({
//   providedIn: 'root',
// })
// // export class InterceptorService implements HttpInterceptor {
// //   constructor(public loaderService: LoaderService) {}

// //   intercept(
// //     req: HttpRequest<any>,
// //     next: HttpHandler
// //   ): Observable<HttpEvent<any>> {
// //     this.loaderService.isLoading.next(true);
// //     return next.handle(req).pipe(
// //       finalize(() => {
// //         this.loaderService.isLoading.next(false);
// //       })
// //     );
// //   }
// // }
// // // После
// export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
//   const loggingService = inject(MyLogger);
//   loggingService.log('do something here', req);
//   return next(req);
// }
