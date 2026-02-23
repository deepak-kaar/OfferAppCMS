import { TestBed } from '@angular/core/testing';
import { ActivateVendorById } from './activate-vendor-by-id';

describe('ActivateVendorById', () => {
  let service: ActivateVendorById;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivateVendorById);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
