import { TestBed } from '@angular/core/testing';

import { ThemeNightService } from './theme-night.service';

describe('ThemeNightService', () => {
  let service: ThemeNightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeNightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
