import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoScroll } from './video-scroll';

describe('VideoScroll', () => {
  let component: VideoScroll;
  let fixture: ComponentFixture<VideoScroll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoScroll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoScroll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
