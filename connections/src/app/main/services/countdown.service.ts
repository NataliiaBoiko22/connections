import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountdownService {
  private countdownGroup$ = new BehaviorSubject<number>(0);
  private countdownPeople$ = new BehaviorSubject<number>(0);
  private countdownGroupsMessages$ = new BehaviorSubject<number>(0);

  setCountdown(
    type: 'groups' | 'people' | 'groupsMessages',
    value: number
  ): void {
    switch (type) {
      case 'groups':
        this.countdownGroup$.next(value);
        break;
      case 'people':
        this.countdownPeople$.next(value);
        break;
      case 'groupsMessages':
        this.countdownGroupsMessages$.next(value);
        break;
      default:
        throw new Error('Invalid countdown type');
    }
  }

  getCountdown(
    type: 'groups' | 'people' | 'groupsMessages'
  ): BehaviorSubject<number> {
    switch (type) {
      case 'groups':
        return this.countdownGroup$;
      case 'people':
        return this.countdownPeople$;
      case 'groupsMessages':
        return this.countdownGroupsMessages$;
      default:
        throw new Error('Invalid countdown type');
    }
  }
}
