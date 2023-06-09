import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserViewPage } from './browser-view.page';

describe('BrowserViewPage', () => {
  let component: BrowserViewPage;
  let fixture: ComponentFixture<BrowserViewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BrowserViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
