import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutManualPage } from './checkout-manual.page';

describe('CheckoutManualPage', () => {
  let component: CheckoutManualPage;
  let fixture: ComponentFixture<CheckoutManualPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutManualPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
