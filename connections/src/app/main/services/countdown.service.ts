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

  private countdownMapGroupDialogs = new Map<string, BehaviorSubject<number>>();

  getCountdownForGroupDialog(groupID: string): BehaviorSubject<number> {
    if (!this.countdownMapGroupDialogs.has(groupID)) {
      this.countdownMapGroupDialogs.set(
        groupID,
        new BehaviorSubject<number>(0)
      );
    }
    return this.countdownMapGroupDialogs.get(groupID)!;
  }

  setCountdownForGroupDialog(groupID: string, value: number): void {
    const countdown$ = this.getCountdownForGroupDialog(groupID);
    countdown$.next(value);
  }

  private countdownMapPeopleConversation = new Map<
    string,
    BehaviorSubject<number>
  >();

  getCountdownForPeopleConversation(
    conversationID: string
  ): BehaviorSubject<number> {
    if (!this.countdownMapPeopleConversation.has(conversationID)) {
      this.countdownMapPeopleConversation.set(
        conversationID,
        new BehaviorSubject<number>(0)
      );
    }
    return this.countdownMapPeopleConversation.get(conversationID)!;
  }

  setCountdownForPeopleConversation(
    conversationID: string,
    value: number
  ): void {
    const countdown$ = this.getCountdownForPeopleConversation(conversationID);
    countdown$.next(value);
  }
}
