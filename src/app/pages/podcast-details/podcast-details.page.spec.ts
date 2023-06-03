import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PodcastDetailsPage } from './podcast-details.page';

describe('PodcastDetailsPage', () => {
  let component: PodcastDetailsPage;
  let fixture: ComponentFixture<PodcastDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PodcastDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
