import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeNightService {
  private readonly THEME_KEY = 'NightTheme';
  private isNightTheme = new BehaviorSubject<boolean>(false);
  nightTheme$: Observable<boolean> = this.isNightTheme.asObservable();
  constructor() {
    const savedTheme = this.getThemeFromLocalStorage();
    if (savedTheme !== null) {
      this.isNightTheme.next(savedTheme);
    }
  }
  toggle(): void {
    const newValue = !this.isNightTheme.value;
    this.isNightTheme.next(newValue);
    this.saveThemeToLocalStorage(newValue);
  }

  isNightThemeValue(): Subject<boolean> {
    return this.isNightTheme;
  }
  saveThemeToLocalStorage(isNightTheme: boolean): void {
    localStorage.setItem(this.THEME_KEY, JSON.stringify(isNightTheme));
  }

  getThemeFromLocalStorage(): boolean | null {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    return savedTheme !== null ? JSON.parse(savedTheme) : null;
  }
}
