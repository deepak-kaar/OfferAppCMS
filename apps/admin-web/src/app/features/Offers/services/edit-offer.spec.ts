import { TestBed } from '@angular/core/testing';

import { EditOffer } from './edit-offer';

describe('EditOffer', () => {
  let service: EditOffer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditOffer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
