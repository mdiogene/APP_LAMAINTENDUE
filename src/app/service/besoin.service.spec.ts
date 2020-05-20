import { TestBed } from '@angular/core/testing';

import { BesoinService } from './besoin.service';

describe('BesoinService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BesoinService = TestBed.get(BesoinService);
    expect(service).toBeTruthy();
  });
});
