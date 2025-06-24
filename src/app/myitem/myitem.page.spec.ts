import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyitemPage } from './myitem.page';

describe('MyitemPage', () => {
  let component: MyitemPage;
  let fixture: ComponentFixture<MyitemPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyitemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
