import { TestBed } from '@angular/core/testing';

import { BesoinUsersService } from './besoin-users.service';

describe('BesoinUsersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BesoinUsersService = TestBed.get(BesoinUsersService);
    expect(service).toBeTruthy();
  });
});
