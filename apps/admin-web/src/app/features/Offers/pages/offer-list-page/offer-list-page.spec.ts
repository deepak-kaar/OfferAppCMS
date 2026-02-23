import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferListPage } from './offer-list-page';

describe('OfferListPage', () => {
  let component: OfferListPage;
  let fixture: ComponentFixture<OfferListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
