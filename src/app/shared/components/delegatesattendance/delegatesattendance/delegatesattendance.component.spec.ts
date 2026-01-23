import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegatesattendanceComponent } from './delegatesattendance.component';

describe('DelegatesattendanceComponent', () => {
  let component: DelegatesattendanceComponent;
  let fixture: ComponentFixture<DelegatesattendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelegatesattendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelegatesattendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
