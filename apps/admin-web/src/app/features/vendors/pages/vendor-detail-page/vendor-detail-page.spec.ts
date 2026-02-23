import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDetailPage } from './vendor-detail-page';

describe('VendorDetailPage', () => {
  let component: VendorDetailPage;
  let fixture: ComponentFixture<VendorDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorDetailPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
