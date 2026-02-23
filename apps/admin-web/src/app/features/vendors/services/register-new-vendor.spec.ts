import { TestBed } from '@angular/core/testing';

import { RegisterNewVendor } from './register-new-vendor';

describe('RegisterNewVendor', () => {
  let service: RegisterNewVendor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterNewVendor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
