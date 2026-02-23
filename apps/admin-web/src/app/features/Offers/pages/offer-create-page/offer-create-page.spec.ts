import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferCreatePage } from './offer-create-page';

describe('OfferCreatePage', () => {
  let component: OfferCreatePage;
  let fixture: ComponentFixture<OfferCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferCreatePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferCreatePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
