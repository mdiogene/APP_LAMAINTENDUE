import { TestBed } from '@angular/core/testing';

import { MaraudeService } from './maraude.service';

describe('MaraudeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaraudeService = TestBed.get(MaraudeService);
    expect(service).toBeTruthy();
  });
});
