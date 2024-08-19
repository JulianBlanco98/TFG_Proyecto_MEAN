import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ap3Component } from './ap3.component';

describe('Ap3Component', () => {
  let component: Ap3Component;
  let fixture: ComponentFixture<Ap3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ap3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ap3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
