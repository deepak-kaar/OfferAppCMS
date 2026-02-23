import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferMainPage } from './offer-main-page';

describe('OfferMainPage', () => {
  let component: OfferMainPage;
  let fixture: ComponentFixture<OfferMainPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferMainPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferMainPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
