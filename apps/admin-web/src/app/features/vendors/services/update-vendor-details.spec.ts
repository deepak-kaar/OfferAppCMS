import { TestBed } from '@angular/core/testing';

import { UpdateVendorDetails } from './update-vendor-details';

describe('UpdateVendorDetails', () => {
  let service: UpdateVendorDetails;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateVendorDetails);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
