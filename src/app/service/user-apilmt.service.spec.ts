import { TestBed } from '@angular/core/testing';

import { UserApilmtService } from './user-apilmt.service';

describe('UserApilmtService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserApilmtService = TestBed.get(UserApilmtService);
    expect(service).toBeTruthy();
  });
});
