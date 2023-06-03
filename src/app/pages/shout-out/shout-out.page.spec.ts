import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoutOutPage } from './shout-out.page';

describe('ShoutOutPage', () => {
  let component: ShoutOutPage;
  let fixture: ComponentFixture<ShoutOutPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ShoutOutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
