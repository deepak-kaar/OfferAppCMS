import { TestBed } from '@angular/core/testing';

import { GetVendorList } from './get-vendor-list';

describe('GetVendorList', () => {
  let service: GetVendorList;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetVendorList);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
