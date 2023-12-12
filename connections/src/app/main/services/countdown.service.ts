import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountdownService {
  private countdownGroup$ = new BehaviorSubject<number>(0);
  private countdownPeople$ = new BehaviorSubject<number>(0);

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


  private countdownMap = new Map<string, BehaviorSubject<number>>();

  getCountdownForGroup(groupID: string): BehaviorSubject<number> {
    if (!this.countdownMap.has(groupID)) {
      this.countdownMap.set(groupID, new BehaviorSubject<number>(0));
    }
    return this.countdownMap.get(groupID)!;
  }

  setCountdownForGroup(groupID: string, value: number): void {
    const countdown$ = this.getCountdownForGroup(groupID);
    countdown$.next(value);
  }
}
