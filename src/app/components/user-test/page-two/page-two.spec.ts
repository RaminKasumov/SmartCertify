import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTwo } from './page-two';

describe('PageTwo', () => {
  let component: PageTwo;
  let fixture: ComponentFixture<PageTwo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageTwo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageTwo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
