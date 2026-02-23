import { TestBed } from '@angular/core/testing';

import { CreateNewOffer } from './create-new-offer';

describe('CreateNewOffer', () => {
  let service: CreateNewOffer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateNewOffer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
