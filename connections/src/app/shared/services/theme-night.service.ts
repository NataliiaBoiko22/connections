import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
// export class ThemeNightService {

//    private isNightTheme = new BehaviorSubject<boolean>(false);

//   nightTheme$ = this.isNightTheme.asObservable();

//   toggle(): void {
//     this.isNightTheme.next(!this.isNightTheme.value);
//   }
// }
export class ThemeNightService {
  private isNightTheme = new BehaviorSubject<boolean>(false);
  nightTheme$: Observable<boolean> = this.isNightTheme.asObservable();

  toggle(): void {
    this.isNightTheme.next(!this.isNightTheme.value);
  }
  isNightThemeValue(): boolean {
    return this.isNightTheme.value;
  }
}
