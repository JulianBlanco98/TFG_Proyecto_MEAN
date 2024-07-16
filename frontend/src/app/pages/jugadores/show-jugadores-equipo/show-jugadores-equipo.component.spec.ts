import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowJugadoresEquipoComponent } from './show-jugadores-equipo.component';

describe('ShowJugadoresEquipoComponent', () => {
  let component: ShowJugadoresEquipoComponent;
  let fixture: ComponentFixture<ShowJugadoresEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowJugadoresEquipoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowJugadoresEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
