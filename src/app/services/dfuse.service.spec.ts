import { TestBed } from '@angular/core/testing';

import { DfuseService } from './dfuse.service';

describe('DfuseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DfuseService = TestBed.get(DfuseService);
    expect(service).toBeTruthy();
  });
});
