import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetExamFeedbackAndSubmit } from './get-exam-feedback-and-submit';

describe('GetExamFeedbackAndSubmit', () => {
  let component: GetExamFeedbackAndSubmit;
  let fixture: ComponentFixture<GetExamFeedbackAndSubmit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetExamFeedbackAndSubmit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetExamFeedbackAndSubmit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
