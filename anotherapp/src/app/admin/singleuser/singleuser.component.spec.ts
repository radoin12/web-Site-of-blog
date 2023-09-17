import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleuserComponent } from './singleuser.component';

describe('SingleuserComponent', () => {
  let component: SingleuserComponent;
  let fixture: ComponentFixture<SingleuserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleuserComponent]
    });
    fixture = TestBed.createComponent(SingleuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
