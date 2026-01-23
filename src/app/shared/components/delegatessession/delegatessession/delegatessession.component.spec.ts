import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegatessessionComponent } from './delegatessession.component';

describe('DelegatessessionComponent', () => {
  let component: DelegatessessionComponent;
  let fixture: ComponentFixture<DelegatessessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelegatessessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelegatessessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
