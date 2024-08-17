import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ap2Component } from './ap2.component';

describe('Ap2Component', () => {
  let component: Ap2Component;
  let fixture: ComponentFixture<Ap2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ap2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ap2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
