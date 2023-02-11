import { TestBed } from '@angular/core/testing';

import { MatchResultApiService } from './match-result-api.service';

describe('MatchResultApiService', () => {
  let service: MatchResultApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchResultApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
