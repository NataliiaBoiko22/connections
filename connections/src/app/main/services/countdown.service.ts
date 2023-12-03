import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountdownService {
  private countdown$ = new BehaviorSubject<number>(0);

  setCountdown(value: number): void {
    this.countdown$.next(value);
  }

  getCountdown(): BehaviorSubject<number> {
    return this.countdown$;
  }
}
