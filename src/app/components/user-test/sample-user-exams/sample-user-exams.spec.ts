import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleUserExams } from './sample-user-exams';

describe('SampleUserExams', () => {
  let component: SampleUserExams;
  let fixture: ComponentFixture<SampleUserExams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleUserExams]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleUserExams);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
