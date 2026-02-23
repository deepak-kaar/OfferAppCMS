import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorListPage } from './vendor-list-page';

describe('VendorListPage', () => {
  let component: VendorListPage;
  let fixture: ComponentFixture<VendorListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
