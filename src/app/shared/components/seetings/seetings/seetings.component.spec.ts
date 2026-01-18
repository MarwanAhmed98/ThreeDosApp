import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeetingsComponent } from './seetings.component';

describe('SeetingsComponent', () => {
  let component: SeetingsComponent;
  let fixture: ComponentFixture<SeetingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeetingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
