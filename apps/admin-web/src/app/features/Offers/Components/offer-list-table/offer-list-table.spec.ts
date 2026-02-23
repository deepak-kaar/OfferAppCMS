import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferListTable } from './offer-list-table';

describe('OfferListTable', () => {
  let component: OfferListTable;
  let fixture: ComponentFixture<OfferListTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferListTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferListTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
