import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVendorDetails } from './edit-vendor-details';

describe('EditVendorDetails', () => {
  let component: EditVendorDetails;
  let fixture: ComponentFixture<EditVendorDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditVendorDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditVendorDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
