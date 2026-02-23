import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferEditPage } from './offer-edit-page';

describe('OfferEditPage', () => {
  let component: OfferEditPage;
  let fixture: ComponentFixture<OfferEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferEditPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferEditPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
