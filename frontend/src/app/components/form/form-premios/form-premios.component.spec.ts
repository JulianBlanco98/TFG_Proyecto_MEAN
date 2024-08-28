import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPremiosComponent } from './form-premios.component';

describe('FormPremiosComponent', () => {
  let component: FormPremiosComponent;
  let fixture: ComponentFixture<FormPremiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPremiosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPremiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
