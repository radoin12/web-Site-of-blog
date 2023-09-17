import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherPostsComponent } from './other-posts.component';

describe('OtherPostsComponent', () => {
  let component: OtherPostsComponent;
  let fixture: ComponentFixture<OtherPostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtherPostsComponent]
    });
    fixture = TestBed.createComponent(OtherPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
