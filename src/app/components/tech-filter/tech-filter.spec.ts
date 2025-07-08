import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechFilter } from './tech-filter';

describe('TechFilter', () => {
  let component: TechFilter;
  let fixture: ComponentFixture<TechFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
