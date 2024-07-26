import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimularJornadaComponent } from './simular-jornada.component';

describe('SimularJornadaComponent', () => {
  let component: SimularJornadaComponent;
  let fixture: ComponentFixture<SimularJornadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimularJornadaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimularJornadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
