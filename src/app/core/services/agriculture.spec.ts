import { TestBed } from '@angular/core/testing';

import { Agriculture } from './agriculture';

describe('Agriculture', () => {
  let service: Agriculture;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Agriculture);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
