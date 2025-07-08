import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageOne } from './page-one';

describe('PageOne', () => {
  let component: PageOne;
  let fixture: ComponentFixture<PageOne>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageOne]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageOne);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
