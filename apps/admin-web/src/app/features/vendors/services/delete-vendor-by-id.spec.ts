import { TestBed } from '@angular/core/testing';

import { DeleteVendorById } from './delete-vendor-by-id';

describe('DeleteVendorById', () => {
  let service: DeleteVendorById;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteVendorById);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
