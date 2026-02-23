import { TestBed } from '@angular/core/testing';

import { DeactiveVendorById } from './deactive-vendor-by-id';

describe('DeactiveVendorById', () => {
  let service: DeactiveVendorById;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeactiveVendorById);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
