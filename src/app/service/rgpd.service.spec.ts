import { TestBed } from '@angular/core/testing';

import { RgpdService } from './rgpd.service';

describe('RgpdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RgpdService = TestBed.get(RgpdService);
    expect(service).toBeTruthy();
  });
});
