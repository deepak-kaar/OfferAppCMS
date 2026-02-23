import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferDetailsPage } from './offer-details-page';

describe('OfferDetailsPage', () => {
  let component: OfferDetailsPage;
  let fixture: ComponentFixture<OfferDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferDetailsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferDetailsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
