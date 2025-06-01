import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabItemPage } from './tab-item.page';

describe('TabItemPage', () => {
  let component: TabItemPage;
  let fixture: ComponentFixture<TabItemPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
