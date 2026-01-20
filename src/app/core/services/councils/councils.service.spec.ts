import { TestBed } from '@angular/core/testing';

import { CouncilsService } from './councils.service';

describe('CouncilsService', () => {
  let service: CouncilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CouncilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
