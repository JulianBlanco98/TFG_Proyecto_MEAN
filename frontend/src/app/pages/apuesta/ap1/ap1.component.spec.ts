import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ap1Component } from './ap1.component';

describe('Ap1Component', () => {
  let component: Ap1Component;
  let fixture: ComponentFixture<Ap1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ap1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ap1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
