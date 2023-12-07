import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountdownService {
  private countdownGroup$ = new BehaviorSubject<number>(0);
  private countdownPeople$ = new BehaviorSubject<number>(0);
  setCountdownGroups(value: number): void {
    this.countdownGroup$.next(value);
  }
  setCountdownPeople(value: number): void {
    this.countdownPeople$.next(value);
  }

  getCountdownGroups(): BehaviorSubject<number> {
    return this.countdownGroup$;
  }
  getCountdownPeople(): BehaviorSubject<number> {
    return this.countdownPeople$;
  }
}
