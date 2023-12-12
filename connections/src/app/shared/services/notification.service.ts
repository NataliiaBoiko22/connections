// notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum toastTypes {
  error,
  success,
}

export interface ToastData {
  title: string;
  content: string;
  type?: toastTypes;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private dataSubject = new BehaviorSubject<ToastData | null>(null);
  public open$ = this.dataSubject.asObservable();

  initiate(data: ToastData) {
    this.dataSubject.next({ ...data });
  }

  hide() {
    this.dataSubject.next(null);
  }
}
