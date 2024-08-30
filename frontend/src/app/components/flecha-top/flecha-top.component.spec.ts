import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlechaTopComponent } from './flecha-top.component';

describe('FlechaTopComponent', () => {
  let component: FlechaTopComponent;
  let fixture: ComponentFixture<FlechaTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlechaTopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlechaTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
