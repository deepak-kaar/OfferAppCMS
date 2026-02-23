import { TestBed } from '@angular/core/testing';

import { GetVendorById } from './get-vendor-by-id';

describe('GetVendorById', () => {
  let service: GetVendorById;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetVendorById);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
