import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestionChoice } from './create-question-choice';

describe('CreateQuestionChoice', () => {
  let component: CreateQuestionChoice;
  let fixture: ComponentFixture<CreateQuestionChoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateQuestionChoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateQuestionChoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
