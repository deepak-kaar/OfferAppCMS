import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorMainPage } from './vendor-main-page';

describe('VendorMainPage', () => {
  let component: VendorMainPage;
  let fixture: ComponentFixture<VendorMainPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorMainPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorMainPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
