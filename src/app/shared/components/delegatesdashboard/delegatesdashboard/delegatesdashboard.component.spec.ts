import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegatesdashboardComponent } from './delegatesdashboard.component';

describe('DelegatesdashboardComponent', () => {
  let component: DelegatesdashboardComponent;
  let fixture: ComponentFixture<DelegatesdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelegatesdashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelegatesdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
