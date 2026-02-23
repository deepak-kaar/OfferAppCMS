import { TestBed } from '@angular/core/testing';

import { CreateNewVendor } from './create-new-vendor';

describe('CreateNewVendor', () => {
  let service: CreateNewVendor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateNewVendor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
