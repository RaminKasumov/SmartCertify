import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserProfile } from './view-user-profile';

describe('ViewUserProfile', () => {
  let component: ViewUserProfile;
  let fixture: ComponentFixture<ViewUserProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewUserProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUserProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
