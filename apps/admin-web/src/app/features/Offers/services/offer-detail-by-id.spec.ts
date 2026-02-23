import { TestBed } from '@angular/core/testing';

import { OfferDetailById } from './offer-detail-by-id';

describe('OfferDetailById', () => {
  let service: OfferDetailById;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferDetailById);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
