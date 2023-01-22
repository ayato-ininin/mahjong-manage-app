import { TestBed } from '@angular/core/testing';

import { MatchSettingApiService } from './match-setting-api.service';

describe('MatchSettingApiService', () => {
  let service: MatchSettingApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchSettingApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
