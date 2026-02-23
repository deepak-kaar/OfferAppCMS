import { TestBed } from '@angular/core/testing';

import { OfferList } from './offer-list';

describe('OfferList', () => {
  let service: OfferList;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferList);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
