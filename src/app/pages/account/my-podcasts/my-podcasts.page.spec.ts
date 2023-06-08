import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyPodcastsPage } from './my-podcasts.page';

describe('MyPodcastsPage', () => {
  let component: MyPodcastsPage;
  let fixture: ComponentFixture<MyPodcastsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MyPodcastsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
