import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegatesteamsComponent } from './delegatesteams.component';

describe('DelegatesteamsComponent', () => {
  let component: DelegatesteamsComponent;
  let fixture: ComponentFixture<DelegatesteamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelegatesteamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelegatesteamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
