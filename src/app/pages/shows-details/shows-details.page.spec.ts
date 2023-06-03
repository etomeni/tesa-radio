import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowsDetailsPage } from './shows-details.page';

describe('ShowsDetailsPage', () => {
  let component: ShowsDetailsPage;
  let fixture: ComponentFixture<ShowsDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ShowsDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
