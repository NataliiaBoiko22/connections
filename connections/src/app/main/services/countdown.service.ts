import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountdownService {
  private countdownGroup$ = new BehaviorSubject<number>(0);
  private countdownPeople$ = new BehaviorSubject<number>(0);
  private countdownGroupMessages$ = new BehaviorSubject<number>(0);

  setCountdownGroup(value: number): void {
    this.countdownGroup$.next(value);
  }

  getCountdownGroup(): BehaviorSubject<number> {
    return this.countdownGroup$;
  }

  setCountdownPeople(value: number): void {
    this.countdownPeople$.next(value);
  }

  getCountdownPeople(): BehaviorSubject<number> {
    return this.countdownPeople$;
  }

  setCountdownGroupMessages(value: number): void {
    this.countdownGroupMessages$.next(value);
  }

  getCountdownGroupMessages(): BehaviorSubject<number> {
    return this.countdownGroupMessages$;
  }
}
