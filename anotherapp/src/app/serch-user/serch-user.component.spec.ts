import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerchUserComponent } from './serch-user.component';

describe('SerchUserComponent', () => {
  let component: SerchUserComponent;
  let fixture: ComponentFixture<SerchUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SerchUserComponent]
    });
    fixture = TestBed.createComponent(SerchUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
