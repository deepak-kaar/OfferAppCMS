import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferTile } from './offer-tile';

describe('OfferTile', () => {
  let component: OfferTile;
  let fixture: ComponentFixture<OfferTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferTile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferTile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
