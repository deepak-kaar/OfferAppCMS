import { TestBed } from '@angular/core/testing';

import { OfferCategorys } from './offer-categorys';

describe('OfferCategorys', () => {
  let service: OfferCategorys;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferCategorys);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
