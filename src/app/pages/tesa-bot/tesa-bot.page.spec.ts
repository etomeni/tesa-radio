import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TesaBotPage } from './tesa-bot.page';

describe('TesaBotPage', () => {
  let component: TesaBotPage;
  let fixture: ComponentFixture<TesaBotPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TesaBotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
