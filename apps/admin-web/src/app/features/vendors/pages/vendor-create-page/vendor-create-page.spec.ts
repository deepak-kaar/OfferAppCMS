import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCreatePage } from './vendor-create-page';

describe('VendorCreatePage', () => {
  let component: VendorCreatePage;
  let fixture: ComponentFixture<VendorCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorCreatePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorCreatePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
