import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyPodcastsDetailsPage } from './my-podcasts-details.page';

describe('MyPodcastsDetailsPage', () => {
  let component: MyPodcastsDetailsPage;
  let fixture: ComponentFixture<MyPodcastsDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MyPodcastsDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
