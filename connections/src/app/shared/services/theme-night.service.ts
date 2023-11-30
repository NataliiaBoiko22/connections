import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeNightService {


   private isNightTheme = new BehaviorSubject<boolean>(false);

  nightTheme$ = this.isNightTheme.asObservable();

  toggle(): void {
    this.isNightTheme.next(!this.isNightTheme.value);
  }
}
